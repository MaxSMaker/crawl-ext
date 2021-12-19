import * as dotenv from "dotenv";
dotenv.config();

import { GameEventProcessor, RandomEventProcessorWrapper } from "./events.js";
import { TwitchBot } from "./twitchBot.js";
import { CsvBot } from "./cvsBot.js";
import { AlertsBot } from "./donationAlertsBot.js";
import process from "process";

const processor = new GameEventProcessor();

const debug = process.env.BOT_DEBUG ? true : false;

if (process.env.LUA_MSG_FILE) {
  processor.setOutFile(process.env.LUA_MSG_FILE);
}

process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (reason, promise) => {
  console.log("Unhandled Exception at:", promise, "reason:", reason);
});

if (process.env.TWITCH_CHANNEL) {
  const voteProcessor = new RandomEventProcessorWrapper(processor, 60000);
  const twitchBot = new TwitchBot(
    voteProcessor,
    process.env.TWITCH_CHANNEL,
    debug
  );
  twitchBot.connect();
}

if (process.env.CSV_URL) {
  const csvBot = new CsvBot(processor, process.env.CSV_URL, debug);
  csvBot.connect();
}

if (process.env.DONATION_ALERTS_TOKEN) {
  const alertsBot = new AlertsBot(
    processor,
    process.env.DONATION_ALERTS_TOKEN,
    debug
  );
  alertsBot.connect();
}
