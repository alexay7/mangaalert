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

            for (let i = 0; i < mangaList.length; i++) {
                const element = mangaList[i];
                const mangaName = $(element).text();
                const url = $(element).find("a").attr("href");

                const promises = targets.map(async (target) => {
                    const cleanName = mangaName.split("]").pop().trim();
                    if (mangaName.includes(target) && !cachedVolumes.includes(cleanName)) {
                        await addNewElementToCache(cleanName);

                        // Add to memory cache
                        cachedVolumes.push(cleanName);

                        await bot.sendMessage(process.env.TELEGRAM_CHAT_ID, `Ha salido un nuevo volumen: ${cleanName}\n${url}`);
                    }
                });

                await Promise.all(promises);
            }
        }
    } catch (error) {
        console.error('Error fetching manga releases:', error);
    }
}
