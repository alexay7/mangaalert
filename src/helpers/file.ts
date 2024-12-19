import fs from 'fs/promises';

export async function writeToFile(path:string,content:string):Promise<{status:"ok"|"error"}>{
    try{
        await fs.writeFile(path,content);
        return {status:"ok"};
    } catch(e){
        console.error(e);
        return {status:"error"};
    }
}

export async function readFileContents<T>(path:string):Promise<T|undefined>{
    try{
        const contents = await fs.readFile(path);
        return JSON.parse(contents.toString());
    } catch(e){
        console.error(e);
        return undefined;
    }
}