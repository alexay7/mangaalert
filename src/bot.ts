import TelegramBot from "node-telegram-bot-api";
import { addNewTarget } from "./manga/file";
import { searchManga } from "./manga/scan";

const token = process.env.BOT_TOKEN;

if (!token) {
  throw new Error("BOT_TOKEN is required");
}

export const bot = new TelegramBot(token,{polling:false});

// Comando para añadir nuevos objetivos
bot.onText(/\/nuevo (.+)/, async(msg, match) => {
    const chatId = msg.chat.id;

    const parameter = match.slice(1).join(" ");

    console.log(chatId);

    const res = await addNewTarget(parameter);

    if(res.status === "ok"){
        bot.sendMessage(chatId,`Añadido ${parameter} a la lista de objetivos`);
    } else {
        bot.sendMessage(chatId,`Error al añadir ${parameter} a la lista de objetivos`);
    }
  });

// Comando para forzar búsqueda
  bot.onText(/\/buscar/, async() => {
    await searchManga();
  });

  export default bot;