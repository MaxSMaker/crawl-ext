import * as dotenv from "dotenv";
dotenv.config();

import fs from "fs";

import {
  FileWriter,
  GameEventProcessor,
  RandomEventProcessorWrapper,
} from "./events.js";
import { TwitchBot } from "./twitchBot.js";
import { CsvBot } from "./cvsBot.js";

let writer: FileWriter = (msg) => console.log(msg);
if (process.env.LUA_MSG_FILE) {
  const file = process.env.LUA_MSG_FILE;
  // Clear output file
  fs.writeFileSync(file, "");

  writer = (msg) => {
    console.log(msg);
    fs.writeFileSync(file, msg + "\n", { flag: "a" });
  };
}

const processor = new GameEventProcessor(writer);

if (process.env.TWITCH_CHANNEL) {
  const voteProcessor = new RandomEventProcessorWrapper(processor, 60000);
  const twitchBot = new TwitchBot(voteProcessor, process.env.TWITCH_CHANNEL);
  twitchBot.connect();
}

if (process.env.CSV_URL) {
  const csvBot = new CsvBot(processor, process.env.CSV_URL);
  csvBot.connect();
}
