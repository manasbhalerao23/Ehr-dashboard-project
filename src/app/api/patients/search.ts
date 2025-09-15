import type { NextApiRequest, NextApiResponse } from 'next';
import { searchPatientsModmed, searchPatientsAthena } from '../../../lib/modmed';
import { searchPatientsAthena as searchAthena } from '../../../lib/athena';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
try {
const q = (req.query.q as string) || req.body.q || '';
const [modmed, athena] = await Promise.allSettled([
searchPatientsModmed(q),
searchAthena(q),
]);
const result = {
modmed: modmed.status === 'fulfilled' ? modmed.value : { error: (modmed as any).reason?.message },
athena: athena.status === 'fulfilled' ? athena.value : { error: (athena as any).reason?.message }
};
res.status(200).json(result);
} catch (err) {
res.status(500).json({ error: (err as Error).message });
}
}