import { IGameEvent } from "./events.js";
import fetch from "node-fetch";
import csv from "csv-string";

export class CsvBot {
  private processed: Record<string, string> = {};
  private regex = /^[a-zA-Z_]+$/;

  constructor(private processor: IGameEvent, private url: string) {}

  connect(): void {
    setInterval(() => this.tick(), 1000);
  }

  private tick(): void {
    // const response = await fetch(this.url);
    // const body = await response.text();
    // const rows = csv.parse(body);

    fetch(this.url)
      .then((response) => response.text())
      .then((body) => {
        const rows = csv.parse(body);
        rows.shift();

        for (const row of rows) {
          if (!this.processed[row[0]]) {
            this.processed[row[0]] = row[1];
            const event = row[1].split(" ", 1).shift();
            if (event && this.regex.test(event)) {
              this.processor.emit(event, row[0]);
            }
          }
        }
      });
  }
}
