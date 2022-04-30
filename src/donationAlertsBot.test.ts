import { AlertsBot } from "./donationAlertsBot.ts";
import { EmitItem, MockProcessor } from "./mockProcessor.ts";
import { assertEquals } from "./deps.test.ts";

Deno.test("DA parser test", async () => {
  const processor = new MockProcessor();
  const bot = new AlertsBot(
    processor,
    "",
    0,
    { "10 USD": "EXTRA_LIFE" },
    [],
    false,
  );

  await bot.processHtml(
    `<div class="event" data-alert_id="96343301"><span class="_sum">5 EUR</span><div class="message-container">!MONEY buy a ring!</div></div>`,
  );

  assertEquals(
    processor.emitted(),
    new Array<EmitItem>(
      new EmitItem("MONEY", "96343301", undefined),
    ),
  );

  await bot.processHtml(
    `<div class="event" data-alert_id="96343301"><span class="_sum">5 EUR</span><div class="message-container">!MONEY buy a ring!</div></div>
     <div class="event" data-alert_id="90319586"><span class="_sum">10 USD</span><div class="message-container">Good game!</div></div>`,
  );

  assertEquals(
    processor.emitted(),
    new Array<EmitItem>(
      new EmitItem("MONEY", "96343301", undefined),
      new EmitItem("EXTRA_LIFE", "90319586", undefined),
    ),
  );
});

Deno.test("DA filter test", async () => {
  const processor = new MockProcessor();
  const bot = new AlertsBot(processor, "", 0, {}, ["MONEY"], false);

  await bot.processHtml(
    `<div class="event" data-alert_id="96343301"><span class="_sum">5 EUR</span><div class="message-container">!MONEY buy a ring!</div></div>
     <div class="event" data-alert_id="90319586"><span class="_sum">10 USD</span><div class="message-container">!ACQUIREMENT Good game!</div></div>`,
  );

  assertEquals(
    processor.emitted(),
    new Array<EmitItem>(
      new EmitItem("MONEY", "96343301", undefined),
    ),
  );
});

Deno.test("DA fixed price test", async () => {
  const processor = new MockProcessor();
  const bot = new AlertsBot(
    processor,
    "",
    0,
    { "10 USD": "EXTRA_LIFE" },
    [],
    false,
  );

  await bot.processHtml(
    `<div class="event" data-alert_id="96343301"><span class="_sum">5 EUR</span><div class="message-container">Buy a ring!</div></div>
     <div class="event" data-alert_id="90319586"><span class="_sum">10 USD</span><div class="message-container">Good game!</div></div>`,
  );

  assertEquals(
    processor.emitted(),
    new Array<EmitItem>(
      new EmitItem("EXTRA_LIFE", "90319586", undefined),
    ),
  );
});
