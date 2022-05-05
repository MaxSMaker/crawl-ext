import { Application, dotenv, Router } from "./deps.ts";
import { IConfig } from "./config.ts";
import { GameEventProcessor, RandomEventProcessorWrapper } from "./events.ts";
import { TwitchBot } from "./twitchBot.ts";
import { CsvBot } from "./cvsBot.ts";
import { AlertsBot } from "./donationAlertsBot.ts";

const env = await dotenv();
const config: IConfig = JSON.parse(
  Deno.readTextFileSync(".config.json").toString(),
);

// Start Web-server
const app = new Application();
const api = new Router();

// Logger
if (config.debug) {
  app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.headers.get("X-Response-Time");
    console.log(`-- ${ctx.request.method} ${ctx.request.url} - ${rt}`);
  });
}

// Timing
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

app.use(async (context, next) => {
  try {
    await context.send({
      root: `${Deno.cwd()}/web`,
      index: "index.html",
    });
  } catch {
    next();
  }
});

// Init event processor
const processor = new GameEventProcessor();

const refreshInterval = config.refreshInterval ? config.refreshInterval : 1000;

if (config.luaMsgPath) {
  processor.setOutFile(config.luaMsgPath);
}

// Init event sources
if (env.TWITCH_CHANNEL) {
  const voteProcessor = new RandomEventProcessorWrapper(processor, 60000);
  const twitchBot = new TwitchBot(
    voteProcessor,
    env.TWITCH_CHANNEL,
    config.twitchMessages,
    config.debug,
  );
  twitchBot.connect();
  api.get("/twitch", (context) => {
    context.response.body = voteProcessor.getStatus();
  });
}

if (env.CSV_URL) {
  const csvBot = new CsvBot(
    processor,
    env.CSV_URL,
    refreshInterval,
    config.debug,
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
    config.debug,
  );
  alertsBot.connect();
}

// Start web-server
const router = new Router().use("/api", api.routes(), api.allowedMethods());
app.use(router.routes());
app.use(router.allowedMethods());
await app.listen({ port: config.port });
