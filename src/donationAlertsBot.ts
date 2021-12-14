import { IGameEvent } from "./events.js";
import axios from "axios";
import { parse } from "node-html-parser";

export class AlertsBot {
  private processed: Record<string, string> = {};
  private regex = /^[a-zA-Z_]+$/;

  constructor(
    private processor: IGameEvent,
    private token: string,
    private debug: boolean = false
  ) {}

  connect(): void {
    setInterval(() => this.tick(), 1000);
    this.tick();
  }

  private tick(): void {
    axios
      .get<string>(
        `https://www.donationalerts.com/widget/lastdonations?alert_type=1&limit=25&token=${this.token}`
      )
      .then((response) => response.data)
      .then((body) => {
        const root = parse(body);
        const events = root.querySelectorAll(".event");

        for (const row of events) {
          const id = row.getAttribute("data-alert_id");

          if (id && !this.processed[id]) {
            const message = row.querySelector(".message-container");
            if (message) {
              const msg = message.textContent.trim();
              this.processed[id] = msg;
              if (this.debug) {
                this.processor.log(msg);
              }

              if (!msg.startsWith("!")) {
                continue;
              }

              const event = msg.slice(1).split(" ", 1).shift();

              if (!event || !this.regex.test(event)) {
                continue;
              }

              this.processor.emit(event, id);
            }
          }
        }
      });
  }
}
