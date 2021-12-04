import { Client, ChatUserstate } from "tmi.js";
import { IGameEvent } from "./events.js";

export class TwitchBot {
  private client: Client;
  private regex = /^[a-zA-Z_]+$/;

  constructor(
    private processor: IGameEvent,
    channel: string,
    private debug = false
  ) {
    this.client = new Client({ channels: [channel] });
    this.client.on(
      "message",
      (
        channel: string,
        userstate: ChatUserstate,
        message: string,
        self: boolean
      ) => {
        this.handler(channel, userstate, message, self);
      }
    );
  }

  connect(): void {
    this.client.connect();
  }

  private handler(
    _channel: string,
    userstate: ChatUserstate,
    message: string,
    _self: boolean // eslint-disable-line @typescript-eslint/no-unused-vars
  ) {
    if (this.debug) {
      this.processor.log(`${userstate.username || "UNKNOWN"}: ${message}`);
    }

    // if (!message.startsWith("!")) {
    //   return;
    // }

    const event = message.slice(0).split(" ", 1).shift();

    if (!event || !this.regex.test(event)) {
      return;
    }

    this.processor.emit(event, userstate.id || "", userstate.username || "");
  }
}
