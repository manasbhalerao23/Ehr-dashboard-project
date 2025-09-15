import { NextApiRequest, NextApiResponse } from 'next';
import { checkAvailabilityAndBook } from '../../../lib/appointments';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
if (req.method !== 'POST') return res.status(405).end();
try {
const payload = req.body;
const result = await checkAvailabilityAndBook(payload);
res.status(200).json(result);
} catch (err) {
res.status(400).json({ error: (err as Error).message });
}
}