import dotenv from "dotenv";
import cron from "node-cron";

dotenv.config();

import bot from "./bot";
import { searchManga } from "./manga/scan";

bot.startPolling();

cron.schedule("0/10 * * * *", async () => {
    await searchManga();
    });