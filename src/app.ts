import * as dotenv from "dotenv";
dotenv.config();

import { GameEventProcessor, RandomEventProcessorWrapper } from "./events.js";
import { TwitchBot } from "./twitchBot.js";
import { CsvBot } from "./cvsBot.js";

const processor = new GameEventProcessor();

if (process.env.TWITCH_CHANNEL) {
  const voteProcessor = new RandomEventProcessorWrapper(processor, 60000);
  const twitchBot = new TwitchBot(voteProcessor, process.env.TWITCH_CHANNEL);
  twitchBot.connect();
}

if (process.env.CSV_URL) {
  const csvBot = new CsvBot(processor, process.env.CSV_URL);
  csvBot.connect();
}
