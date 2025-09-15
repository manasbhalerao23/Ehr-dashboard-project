import axios from 'axios';


const tokenUrl = process.env.ATHENA_OAUTH_TOKEN_URL!;
const clientId = process.env.ATHENA_CLIENT_ID!;
const clientSecret = process.env.ATHENA_CLIENT_SECRET!;
const baseUrl = process.env.ATHENA_BASE_URL!;


let cachedToken: { access_token: string; expires_at: number } | null = null;


async function getToken() {
if (cachedToken && Date.now() < cachedToken.expires_at - 30000) return cachedToken.access_token;
const res = await axios.post(tokenUrl, new URLSearchParams({ grant_type: 'client_credentials' }), {
auth: { username: clientId, password: clientSecret },
headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
});
const token = res.data;
cachedToken = { access_token: token.access_token, expires_at: Date.now() + token.expires_in * 1000 };
return cachedToken.access_token;
}


export async function searchPatientsAthena(query: string) {
const token = await getToken();
const res = await axios.get(`${baseUrl}/v1/patients`, { headers: { Authorization: `Bearer ${token}` }, params: { search: query } });
return res.data;
}


export async function getPatientAthena(id: string) {
const token = await getToken();
const res = await axios.get(`${baseUrl}/v1/${process.env.ATHENA_PRACTICE_ID}/patients/${id}`, { headers: { Authorization: `Bearer ${token}` } });
return res.data;
}