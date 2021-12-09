import { IGameEvent } from "./events.js";
import axios from "axios";

interface Datum {
  id: number;
  name: string;
  username: string;
  message: string;
  amount: number;
  currency: string;
  is_shown: number;
  created_at: string;
  shown_at?: string;
}

interface Links {
  first: string;
  last: string;
  prev?: string;
  next?: string;
}

interface Meta {
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

interface RootObject {
  data: Datum[];
  links: Links;
  meta: Meta;
}

export class AlertsBot {
  private processed: Record<number, string> = {};
  private regex = /^[a-zA-Z_]+$/;

  constructor(private processor: IGameEvent, private token: string) {}

  connect(): void {
    setInterval(() => this.tick(), 1000);
  }

  private tick(): void {
    axios
      .get<RootObject>(
        "https://www.donationalerts.com/api/v1/alerts/donations",
        {
          headers: {
            Authorization: "Bearer " + this.token,
          },
        }
      )
      .then((response) => response.data)
      .then((body) => {
        for (const row of body.data) {
          if (!this.processed[row.id]) {
            this.processed[row.id] = row.message;
            const event = row.message.split(" ", 1).shift();
            if (event && this.regex.test(event)) {
              this.processor.emit(event, "da_" + row.id);
            }
          }
        }
      });
  }
}
