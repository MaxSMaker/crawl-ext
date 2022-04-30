import { IrcMessage, TwitchChat } from "../deps.ts";
import { IGameEvent } from "./events.ts";

export class TwitchBot {
  private client: TwitchChat;
  private events: Set<string>;
  private regex = /^[a-zA-Z_]+$/;

  public constructor(
    private processor: IGameEvent,
    private channel: string,
    events: string[],
    private debug = false,
  ) {
    this.client = new TwitchChat(
      "",
      `justinfan${Math.floor(10000 + Math.random() * 10000)}`,
    );
    this.events = new Set<string>(events);
  }

  public async connect() {
    await this.client.connect();
    const channel = this.client.joinChannel(this.channel);

    for await (const ircMsg of channel) {
      switch (ircMsg.command) {
        case "PRIVMSG":
          this.handler(ircMsg);
          break;
      }
    }
  }

  public handler(
    ircMsg: IrcMessage,
  ) {
    if (this.debug) {
      this.processor.log(`${ircMsg.username || "UNKNOWN"}: ${ircMsg.message}`);
    }

    if (!ircMsg.message.startsWith("!")) {
      return;
    }

    const event = ircMsg.message.slice(1).split(" ", 1).shift();

    if (!event || !this.regex.test(event)) {
      return;
    }

    const upEvent = event.toUpperCase();
    if (this.events.size > 0 && !this.events.has(upEvent)) {
      return;
    }

    this.processor.emit(upEvent, "", ircMsg.username || "");
  }
}
