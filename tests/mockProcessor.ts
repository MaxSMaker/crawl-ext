import { IGameEvent } from "../src/events.ts";

export class EmitItem {
  public type: string;
  public id?: string;
  public from?: string;

  constructor(type: string, id?: string, from?: string) {
    this.type = type;
    this.id = id;
    this.from = from;
  }
}

export class MockProcessor implements IGameEvent {
  private emits: Array<EmitItem> = new Array<EmitItem>();
  private logs: Array<string> = new Array<string>();

  emit(type: string, id?: string, from?: string): void {
    this.emits.push(new EmitItem(type, id, from));
  }

  log(msg: string): void {
    this.logs.push(msg);
  }

  public emitted(): Array<EmitItem> {
    return this.emits;
  }

  public logged(): Array<string> {
    return this.logs;
  }
}
