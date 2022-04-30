import { CsvBot } from "../src/cvsBot.ts";
import { EmitItem, MockProcessor } from "./mockProcessor.ts";
import { assertEquals } from "../dev_deps.ts";

Deno.test("CSV parser test", async () => {
  const processor = new MockProcessor();
  const bot = new CsvBot(processor, "", 0, false);

  await bot.processCSV(
    `TIME,EVENT
04.12.2021 17:49:38,HEAL - восстановить здоровье`,
  );

  assertEquals(
    processor.emitted(),
    new Array<EmitItem>(
      new EmitItem("HEAL", "04.12.2021 17:49:38", undefined),
    ),
  );

  await bot.processCSV(
    `TIME,EVENT
04.12.2021 17:49:38,HEAL - восстановить здоровье
04.12.2021 17:51:05,IDENTIFY - идентифицировать все в инвентаре
04.12.2021 17:51:26,KNOWLEDGE  - идентифицировать все предметы в игре`,
  );

  assertEquals(
    processor.emitted(),
    new Array<EmitItem>(
      new EmitItem("HEAL", "04.12.2021 17:49:38", undefined),
      new EmitItem("IDENTIFY", "04.12.2021 17:51:05", undefined),
      new EmitItem("KNOWLEDGE", "04.12.2021 17:51:26", undefined),
    ),
  );
});
