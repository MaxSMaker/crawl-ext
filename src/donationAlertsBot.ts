import { IGameEvent } from "./events.ts";
import { delay, DOMParser, Element } from "./deps.ts";

const regex = /^[a-zA-Z_]+$/;

class Event {
  constructor(
    public id: string,
    public msg: string,
    public event: string,
    public sum: string,
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
    private debug: boolean = false,
  ) {
    this.events = new Set<string>(events);
  }

  public async connect(): Promise<void> {
    while (true) {
      try {
        const response = await fetch(
          `https://www.donationalerts.com/widget/lastdonations?alert_type=1&limit=25&token=${this.token}`,
        );

        if (response.status == 200) {
          const body = await response.text();
          this.processHtml(body);
        }

        await delay(this.refreshInterval);
      } catch (err) {
        if (this.debug) {
          console.log(err);
        }
      }
    }
  }

  public processHtml(body: string) {
    const root = new DOMParser().parseFromString(body, "text/html");
    if (!root) return;

    const events = root.getElementsByClassName("event");

    for (const row of events) {
      const id = row.getAttribute("data-alert_id");

      if (id && !(id in this.processed)) {
        const event = this.parseRow(id, row);

        if (!event) {
          this.processed[id] = "?";
          continue;
        }

        this.processed[id] = event.event;
        if (this.debug) {
          this.processor.log(JSON.stringify(event));
        }

        if (
          event.event && (this.events.size == 0 || this.events.has(event.event))
        ) {
          this.processor.emit(event.event, id);
          continue;
        }

        if (this.price[event.sum]) {
          this.processor.emit(this.price[event.sum], id);
        }
      }
    }
  }

  public parseRow(id: string, row: Element): Event | null {
    const message = row.querySelector(".message-container");

    const msg = message && message.textContent
      ? message.textContent.trim()
      : "";

    const sum = row.querySelector("._sum");
    if (!sum || !sum.textContent) {
      return null;
    }
    return new Event(id, msg, this.getEvent(msg), sum.textContent.trim());
  }

  public getEvent(msg: string): string {
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
