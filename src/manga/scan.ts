import axios from 'axios';
import * as cheerio from 'cheerio';
import { addNewElementToCache, readCacheFile, readTargetsFile } from './file';
import bot from '../bot';

export async function searchManga(): Promise<void> {
    console.log("scaning");
    const mangaUrl = `${process.env.MANGA_URL}`;

    const targets = await readTargetsFile();
    const cachedVolumes = await readCacheFile();

    try {
        const response = await axios.get(mangaUrl, {
            headers: { "User-Agent": "Mozilla/5.0" },
            timeout: 5000
        });

        if (response.status === 200) {
            const $ = cheerio.load(response.data);
            const mangaList = $("h2.entry-title");

            mangaList.each((_, element) => {
                const mangaName = $(element).text();

                // Check if it's on the target list
                for (const target of targets) {
                    const cleanName = mangaName.split("]").pop().trim();
                    if (mangaName.includes(target) && !cachedVolumes.includes(cleanName)) {
                        addNewElementToCache(cleanName);

                        bot.sendMessage(process.env.TELEGRAM_CHAT_ID, `Ha salido un nuevo volumen: ${cleanName}\n${mangaUrl}`);
                        break;
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error fetching manga releases:', error);
    }
}
