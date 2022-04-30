export interface EventWriter {
  (msg: string): void;
}

export interface IGameEvent {
  emit(type: string, id?: string, from?: string): void;
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

export class RandomEventProcessorWrapper implements IGameEvent {
  private events: Map<string, string> = new Map<string, string>();
  private voteRound = 0;

  public constructor(private processor: IGameEvent, periodInMs: number) {
    setInterval(() => this.tick(), periodInMs);
  }

  public emit(type: string, _id?: string, from?: string): void {
    if (from) {
      this.events.set(from, type);
    }
  }

  public log(msg: string): void {
    this.processor.log(msg);
  }

  private tick() {
    if (this.events.size == 0) {
      return;
    }

    const copy = this.events;
    this.events = new Map<string, string>();

    const index = Math.floor(Math.random() * copy.size);
    const keys = Array.from<string>(copy.keys());
    const key = keys[index];
    const msg = copy.get(key);
    this.processor.emit(msg + " - " + key, "V_" + this.voteRound++);
  }
}
