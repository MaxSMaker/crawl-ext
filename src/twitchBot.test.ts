import { TwitchBot } from "./twitchBot.ts";
import { EmitItem, MockProcessor } from "./mockProcessor.ts";
import { assertEquals } from "./deps.test.ts";
import { IrcMessage } from "./deps.ts";

class MockMsg {
  constructor(
    public message: string,
    public username: string,
    public tags: Record<string, string>,
  ) {
  }
}

Deno.test("Twitch ignore text parser test", () => {
  const processor = new MockProcessor();
  const bot = new TwitchBot(processor, "", [], false);

  bot.handler(new MockMsg("!ПРИВЕТ", "user", { id: "id1" }) as IrcMessage);
  bot.handler(new MockMsg("Goog game!", "user", { id: "id2" }) as IrcMessage);

  assertEquals(
    processor.emitted(),
    new Array<EmitItem>(),
  );
});

Deno.test("Twitch msg parser test", () => {
  const processor = new MockProcessor();
  const bot = new TwitchBot(processor, "", [], false);

  bot.handler(new MockMsg("!HEAL alive!", "user", { id: "id1" }) as IrcMessage);

  assertEquals(
    processor.emitted(),
    new Array<EmitItem>(
      new EmitItem("HEAL", "", "user", "!HEAL alive!"),
    ),
  );
});

Deno.test("Twitch msg filter test", () => {
  const processor = new MockProcessor();
  const bot = new TwitchBot(processor, "", ["HEAL"], false);

  bot.handler(new MockMsg("!HEAL alive!", "user", { id: "id1" }) as IrcMessage);
  bot.handler(
    new MockMsg("!ACQUIREMENT alive!", "user", { id: "id2" }) as IrcMessage,
  );

  assertEquals(
    processor.emitted(),
    new Array<EmitItem>(
      new EmitItem("HEAL", "", "user", "!HEAL alive!"),
    ),
  );
});

Deno.test("Twitch msg doublesfilter test", () => {
  const processor = new MockProcessor();
  const bot = new TwitchBot(processor, "", ["HEAL"], false);

  bot.handler(new MockMsg("!HEAL alive!", "user", { id: "id1" }) as IrcMessage);
  bot.handler(new MockMsg("!HEAL alive!", "user", { id: "id1" }) as IrcMessage);

  assertEquals(
    processor.emitted(),
    new Array<EmitItem>(
      new EmitItem("HEAL", "", "user", "!HEAL alive!"),
    ),
  );
});
