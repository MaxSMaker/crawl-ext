import * as dotenv from "dotenv";
dotenv.config();

import { GameEventProcessor } from "./events.js";
import { TwitchBot } from "./twitchBot.js";
import { CsvBot } from "./cvsBot.js";

const processor = new GameEventProcessor();

if (process.env.TWITCH_CHANNEL) {
  const twitchBot = new TwitchBot(processor, process.env.TWITCH_CHANNEL);
  twitchBot.connect();
}

if (process.env.CSV_URL) {
  const csvBot = new CsvBot(processor, process.env.CSV_URL);
  csvBot.connect();
}
