import { csv, delay } from "../deps.ts";
import { IGameEvent } from "./events.ts";

export class CsvBot {
  private processed: Record<string, string> = {};
  private regex = /^[a-zA-Z_]+$/;

  public constructor(
    private processor: IGameEvent,
    private url: string,
    private refreshInterval: number,
    private debug: boolean,
  ) {}

  public async connect(): Promise<void> {
    while (true) {
      try {
        const response = await fetch(this.url);

        if (response.status == 200) {
          const body = await response.text();

          const rows = await csv(body);
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
        }

        await delay(this.refreshInterval);
      } catch (err) {
        console.log(err);
      }
    }
  }
}
