import { IGameEvent } from "./events.js";
import fetch from "node-fetch";
import { parse, HTMLElement } from "node-html-parser";

const regex = /^[a-zA-Z_]+$/;

class Event {
  constructor(
    public id: string,
    public msg: string,
    public event: string,
    public sum: string
  ) {}
}

export class AlertsBot {
  private processed: Record<string, string> = {};
  private events: Set<string>;

  constructor(
    private processor: IGameEvent,
    private token: string,
    private refreshInterval: number,
    private price: Record<string, string>,
    events: string[],
    private debug: boolean = false
  ) {
    this.events = new Set<string>(events);
  }

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
            const event = this.parseRow(id, row);

            if (this.debug) {
              this.processor.log(JSON.stringify(event));
            }

            if (!event) {
              continue;
            }

            if (this.events.has(event.event)) {
              this.processor.emit(event.event, id);
              continue;
            }

            if (this.price[event.sum]) {
              this.processor.emit(this.price[event.sum], id);
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

  private parseRow(id: string, row: HTMLElement): Event | null {
    const message = row.querySelector(".message-container");

    const msg =
      message && message.textContent ? message.textContent.trim() : "";

    const sum = row.querySelector("._sum");
    if (!sum || !sum.textContent) {
      return null;
    }
    return new Event(id, msg, this.getEvent(msg), sum.textContent.trim());
  }

  private getEvent(msg: string): string {
    if (!msg.startsWith("!")) {
      return "";
    }

    const event = msg.slice(1).split(" ", 1).shift();
    if (event && regex.test(event)) {
      return event.toUpperCase();
    }

    return "";
  }
}
