import { IGameEvent } from "./events.js";
import fetch from "node-fetch";
import csv from "csv-string";

export class CsvBot {
  private processed: Record<string, string> = {};
  private regex = /^[a-zA-Z_]+$/;

  constructor(
    private processor: IGameEvent,
    private url: string,
    private refreshInterval: number,
    private debug: boolean
  ) {}

  connect(): void {
    setTimeout(() => this.tick(), 0);
  }

  private tick(): void {
    fetch(this.url)
      .then((response) => (response.status == 200 ? response.text() : ""))
      .then((body) => {
        const rows = csv.parse(body);
        rows.shift();

        for (const row of rows) {
          if (!(row[0] in this.processed)) {
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
      })
      .finally(() => setTimeout(() => this.tick(), this.refreshInterval));
  }
}
