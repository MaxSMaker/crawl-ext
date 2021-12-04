import EventEmitter from "events";
import TypedEmitter from "typed-emitter";

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

  constructor() {
    this.messageEmitter.on(
      "message",
      (type: string, id?: string, from?: string) =>
        this.onMessage(type, id, from)
    );
    this.messageEmitter.on("log", (msg: string) => this.onLog(msg));
  }

  emit(type: string, from: string): void {
    this.messageEmitter.emit("message", type, from);
  }

  log(msg: string): void {
    this.messageEmitter.emit("log", msg);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private onMessage(body: string, id?: string, _from?: string) {
    const msg = this.escape(body.toUpperCase());
    const index = this.escape(id || "ID_" + this.evIndex++);

    console.log(`EXT.events["${index}"] = "${msg}"`);
  }

  private onLog(msg: string) {
    const value = this.escape(msg);
    console.log(`-- ${this.escape(value)}`);
  }

  private escape(str: string): string {
    return str.replace("\n", "").replace("\r", "");
  }
}

export class RandomEventProcessorWrapper implements IGameEvent {
  private events: Array<string> = [];
  private voteRound = 0;

  constructor(private processor: IGameEvent, periodInMs: number) {
    setInterval(() => this.tick(), periodInMs);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  emit(type: string, _id?: string, _from?: string): void {
    this.events.push(type);
  }

  log(msg: string): void {
    this.processor.log(msg);
  }

  private tick() {
    if (this.events.length == 0) {
      return;
    }

    const copy = this.events;
    this.events = [];

    const index = Math.floor(Math.random() * copy.length);
    const msg = copy[index];
    this.processor.emit(msg, "V_" + this.voteRound++);
  }
}
