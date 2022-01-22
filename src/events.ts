import EventEmitter from "events";
import TypedEmitter from "typed-emitter";
import fs from "fs";

export interface EventWriter {
  (msg: string): void;
}

interface MessageEvents {
  message: (body: string, from: string) => void;
  log: (msg: string) => void;
}

export interface IGameEvent {
  emit(type: string, id?: string, from?: string): void;
  log(msg: string): void;
}

export class GameEventProcessor implements IGameEvent {
  private evIndex = 0;
  private messageEmitter = new EventEmitter() as TypedEmitter<MessageEvents>;
  private writer: EventWriter = (msg) => console.log(msg);

  constructor() {
    this.messageEmitter.on(
      "message",
      (type: string, id?: string, from?: string) =>
        this.onMessage(type, id, from)
    );
    this.messageEmitter.on("log", (msg: string) => this.onLog(msg));
  }

  setOutFile(fileName: string) {
    fs.writeFileSync(fileName, ""); // Clear output file
    this.writer = (msg) => {
      console.log(msg);
      fs.writeFileSync(fileName, msg + "\n", { flag: "a" });
    };
  }

  emit(type: string, from: string): void {
    this.messageEmitter.emit("message", type, from);
  }

  log(msg: string): void {
    this.messageEmitter.emit("log", msg);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private onMessage(body: string, id?: string, _from?: string) {
    const msg = this.escape(body);
    const index = this.escape(id || "ID_" + this.evIndex++);

    this.writer(`EXT.events["${index}"] = "${msg}"`);
  }

  private onLog(msg: string) {
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

  constructor(private processor: IGameEvent, periodInMs: number) {
    setInterval(() => this.tick(), periodInMs);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  emit(type: string, _id?: string, from?: string): void {
    if (from) {
      this.events.set(from, type);
    }
  }

  log(msg: string): void {
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
