import * as dotenv from "dotenv";
dotenv.config();

import { IConfig } from "./config.js";
import { GameEventProcessor, RandomEventProcessorWrapper } from "./events.js";
import { TwitchBot } from "./twitchBot.js";
import { CsvBot } from "./cvsBot.js";
import { AlertsBot } from "./donationAlertsBot.js";
import process from "process";
import fs from "fs";

const processor = new GameEventProcessor();

const rawData = fs.readFileSync(".config.json");
const config: IConfig = JSON.parse(rawData.toString());

const refreshInterval = config.refreshInterval ? config.refreshInterval : 1000;

if (config.luaMsgPath) {
  processor.setOutFile(config.luaMsgPath);
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
    config.debugMsg
  );
  twitchBot.connect();
}

if (process.env.CSV_URL) {
  const csvBot = new CsvBot(
    processor,
    process.env.CSV_URL,
    refreshInterval,
    config.debugMsg
  );
  csvBot.connect();
}

if (process.env.DONATION_ALERTS_TOKEN) {
  const alertsBot = new AlertsBot(
    processor,
    process.env.DONATION_ALERTS_TOKEN,
    refreshInterval,
    config.donationAlertPriceList,
    config.debugMsg
  );
  alertsBot.connect();
}
