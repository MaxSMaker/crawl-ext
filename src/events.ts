import { delay } from "./deps.ts";

export interface EventWriter {
  (msg: string): void;
}

export interface IGameEvent {
  emit(type: string, id?: string, from?: string, msg?: string): void;
  log(msg: string): void;
}

export class GameEventProcessor implements IGameEvent {
  private evIndex = 0;
  private writer: EventWriter = (msg) => console.log(msg);
  private encoder: TextEncoder = new TextEncoder();

  public setOutFile(fileName: string) {
    Deno.writeFileSync(fileName, new Uint8Array()); // Clear output file
    this.writer = (msg) => {
      console.log(msg);
      const data = this.encoder.encode(msg + "\n");
      Deno.writeFileSync(fileName, data, { append: true });
    };
  }

  public emit(type: string, id: string): void {
    const msg = this.escape(type);
    const index = this.escape(id || "ID_" + this.evIndex++);

    this.writer(`EXT.events["${index}"] = "${msg}"`);
  }

  public log(msg: string): void {
    const value = this.escape(msg);
    this.writer(`-- ${this.escape(value)}`);
  }

  private escape(str: string): string {
    return str.replace("\n", "").replace("\r", "");
  }
}

export class RandomEventProcessorStatus {
  public constructor(
    public interval: number,
    public begin: Date,
    public from?: string,
    public msg?: string,
  ) {}
}

export class RandomEventProcessorWrapper implements IGameEvent {
  private events: Map<string, string[]> = new Map<string, string[]>();
  private voteRound = 0;
  private status: RandomEventProcessorStatus;

  public constructor(
    private processor: IGameEvent,
    private periodInMs: number,
  ) {
    this.status = new RandomEventProcessorStatus(
      this.periodInMs,
      new Date(),
      undefined,
      undefined,
    );
    this.start();
  }

  public emit(type: string, _id?: string, from?: string, msg?: string): void {
    if (from) {
      this.events.set(from, [type, msg || ""]);
    }
  }

  public log(msg: string): void {
    this.processor.log(msg);
  }

  public getStatus(): RandomEventProcessorStatus {
    return this.status;
  }

  private async start() {
    while (true) {
      try {
        this.status = this.tick();
        await delay(this.periodInMs);
      } catch (ex) {
        console.log(ex);
      }
    }
  }

  private tick(): RandomEventProcessorStatus {
    if (this.events.size == 0) {
      return new RandomEventProcessorStatus(
        this.periodInMs,
        new Date(),
        undefined,
        undefined,
      );
    }

    const copy = this.events;
    this.events = new Map<string, string[]>();

    const index = Math.floor(Math.random() * copy.size);
    const keys = Array.from<string>(copy.keys());
    const key = keys[index];
    const [type, msg] = copy.get(key) || [];
    this.processor.emit(type + " - " + key, "V_" + this.voteRound++);
    return new RandomEventProcessorStatus(
      this.periodInMs,
      new Date(),
      key,
      msg || type,
    );
  }
}
