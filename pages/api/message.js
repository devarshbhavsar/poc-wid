import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        //Find the absolute path of the json directory
        const jsonDirectory = path.join(process.cwd(), 'json');
        //Read the json data file data.json
        const fileContents = await fs.readFile(jsonDirectory + '/message.json', 'utf8');
        //Return the content of the data file in json format
        res.status(200).json(fileContents);
    }
    else if (req.method === 'POST') {
        const richMessage = req.body;
        //Find the absolute path of the json directory
        const jsonDirectory = path.join(process.cwd(), 'json');
        //Read the json data file data.json
        await fs.writeFile(jsonDirectory + '/message.json', JSON.stringify(richMessage), 'utf8')
        res.status(200).json(richMessage);
    }
}