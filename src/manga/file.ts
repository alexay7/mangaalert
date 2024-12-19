import { writeToFile, readFileContents } from "../helpers/file";
import {join} from "path";

export async function createCacheFile():Promise<{status:"ok"|"error"}>{
    return writeToFile(join("/temp","cache.json"),"[]");
}

export async function readCacheFile():Promise<string[]|undefined>{
    const result = await readFileContents<string[]>(join("/temp","cache.json"));

    if(result === undefined){
        await createCacheFile();
        return [];
    }

    return result;
}

export async function addNewElementToCache(element:string):Promise<{status:"ok"|"error"}>{
    let cache = await readCacheFile();

    if(cache === undefined){
        await createCacheFile();
        cache = [];
    }

    if(cache.includes(element)){
        return {status:"ok"};
    }

    cache.push(element);

    return writeToFile(join("/temp","cache.json"),JSON.stringify(cache));
}

export async function createTargetsFile():Promise<{status:"ok"|"error"}>{
    return writeToFile(join("/temp","targets.json"),"[]");
}

export async function readTargetsFile():Promise<string[]|undefined>{
    const result = await readFileContents<string[]>(join("/temp","targets.json"));

    if(result === undefined){
        await createTargetsFile();
        return [];
    }

    return result;
}

export async function addNewTarget(target:string):Promise<{status:"ok"|"error"}>{
    let targets = await readTargetsFile();

    if(targets === undefined){
        await createTargetsFile();
        targets = [];
    }

    if(targets.includes(target)){
        return {status:"ok"};
    }

    targets.push(target);

    return writeToFile(join("/temp","targets.json"),JSON.stringify(targets));
}