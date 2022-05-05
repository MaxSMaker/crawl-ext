import { delay, IrcMessage, TwitchChat } from "./deps.ts";
import { IGameEvent } from "./events.ts";

export class TwitchBot {
  private processed: Set<string> = new Set();
  private events: Set<string>;
  private regex = /^[a-zA-Z_]+$/;

  public constructor(
    private processor: IGameEvent,
    private channel: string,
    events: string[],
    private debug = false,
  ) {
    this.events = new Set<string>(events);
  }

  public async connect() {
    while (true) {
      try {
        this.newSession();
        await delay(10000);
      } catch (err) {
        if (this.debug) {
          console.log(err);
        }
      }
    }
  }

  private async newSession() {
    try {
      const client = new TwitchChat(
        "",
        `justinfan${Math.floor(10000 + Math.random() * 10000)}`,
      );

      await client.connect();

      const channel = client.joinChannel(this.channel);
      channel.addEventListener("privmsg", (ircMsg) => {
        this.handler(ircMsg);
      });

      await delay(30000);
      client.disconnect();
    } catch (err) {
      if (this.debug) {
        console.log(err);
      }
    }
  }

  public handler(
    ircMsg: IrcMessage,
  ) {
    if (this.processed.has(ircMsg.tags.id)) {
      return;
    }
    this.processed.add(ircMsg.tags.id);

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

    this.processor.emit(upEvent, "", ircMsg.username || "", ircMsg.message);
  }
}
