import { IGameEvent } from "./events.ts";

export class EmitItem {
  constructor(
    public type: string,
    public id?: string,
    public from?: string,
    public msg?: string,
  ) {
  }
}

export class MockProcessor implements IGameEvent {
  private emits: Array<EmitItem> = new Array<EmitItem>();
  private logs: Array<string> = new Array<string>();

  emit(type: string, id?: string, from?: string, msg?: string): void {
    this.emits.push(new EmitItem(type, id, from, msg));
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
