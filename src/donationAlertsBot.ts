import { IGameEvent } from "./events.js";
import fetch from "node-fetch";
import { parse } from "node-html-parser";

export class AlertsBot {
  private processed: Record<string, string> = {};
  private regex = /^[a-zA-Z_]+$/;

  constructor(
    private processor: IGameEvent,
    private token: string,
    private refreshInterval: number,
    private price: Record<string, string>,
    private debug: boolean = false
  ) {}

  connect(): void {
    setTimeout(() => this.tick(), 0);
  }

  private tick(): void {
    fetch(
      `https://www.donationalerts.com/widget/lastdonations?alert_type=1&limit=25&token=${this.token}`
    )
      .then((response) => (response.status == 200 ? response.text() : ""))
      .then((body) => {
        const root = parse(body);
        const events = root.querySelectorAll(".event");

        for (const row of events) {
          const id = row.getAttribute("data-alert_id");

          if (id && !(id in this.processed)) {
            const sum = row.querySelector("._sum");
            if (sum) {
              const text = sum.textContent.trim();
              this.processed[id] = text;
              const event = this.price[text];

              if (this.debug) {
                this.processor.log(`${text} - ${event}`);
              }

              if (!event) {
                continue;
              }

              this.processor.emit(event.toUpperCase(), id);
            }
          }
        }
      })
      .catch((err) => {
        if (this.debug) {
          console.log(err.name + ": " + err.message);
        }
      })
      .finally(() => setTimeout(() => this.tick(), this.refreshInterval));
  }
}
