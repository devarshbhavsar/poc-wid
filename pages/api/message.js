var richMessage = {};

export default async function handler(req, res) {
    if (req.method === 'POST') {
        richMessage = JSON.stringify(req.body);
        res.status(200).json(richMessage);
    }
    else {
        res.status(200).json(richMessage);
    }
}