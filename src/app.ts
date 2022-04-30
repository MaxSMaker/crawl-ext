import { dotenv } from "./deps.ts";
const env = await dotenv();

import { IConfig } from "./config.ts";
import {
  GameEventProcessor,
  RandomEventProcessorWrapper,
} from "./events.ts";
import { TwitchBot } from "./twitchBot.ts";
import { CsvBot } from "./cvsBot.ts";
import { AlertsBot } from "./donationAlertsBot.ts";

const processor = new GameEventProcessor();
const config: IConfig = JSON.parse(
  Deno.readTextFileSync(".config.json").toString(),
);

const refreshInterval = config.refreshInterval ? config.refreshInterval : 1000;

if (config.luaMsgPath) {
  processor.setOutFile(config.luaMsgPath);
}

if (env.TWITCH_CHANNEL) {
  const voteProcessor = new RandomEventProcessorWrapper(processor, 60000);
  const twitchBot = new TwitchBot(
    voteProcessor,
    env.TWITCH_CHANNEL,
    config.twitchMessages,
    config.debugMsg,
  );
  twitchBot.connect();
}

if (env.CSV_URL) {
  const csvBot = new CsvBot(
    processor,
    env.CSV_URL,
    refreshInterval,
    config.debugMsg,
  );
  csvBot.connect();
}

if (env.DONATION_ALERTS_TOKEN) {
  const alertsBot = new AlertsBot(
    processor,
    env.DONATION_ALERTS_TOKEN,
    refreshInterval,
    config.donationAlertPriceList,
    config.donationAlertMessages,
    config.debugMsg,
  );
  alertsBot.connect();
}
