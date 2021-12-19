import { IGameEvent } from "./events.js";
import axios from "axios";
import csv from "csv-string";

export class CsvBot {
  private processed: Record<string, string> = {};
  private regex = /^[a-zA-Z_]+$/;

  constructor(
    private processor: IGameEvent,
    private url: string,
    private debug: boolean
  ) {}

  connect(): void {
    setInterval(() => this.tick(), 1000);
    this.tick();
  }

  private tick(): void {
    axios
      .get<string>(this.url)
      .then((response) => response.data)
      .then((body) => {
        const rows = csv.parse(body);
        rows.shift();

        for (const row of rows) {
          if (!this.processed[row[0]]) {
            if (this.debug) {
              this.processor.log(row[1]);
            }
            this.processed[row[0]] = row[1];
            const event = row[1].split(" ", 1).shift();
            if (event && this.regex.test(event)) {
              this.processor.emit(event, row[0]);
            }
          }
        }
      })
      .catch((err) => {
        if (this.debug) {
          console.log(err.name + ": " + err.message);
        }
      });
  }
}
