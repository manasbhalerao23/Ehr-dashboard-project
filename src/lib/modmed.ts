import axios from 'axios';


const BASE = process.env.MODMED_BASE_URL; // e.g. https://stage.ema-api.com/ema-dev/firm
const PREFIX = process.env.MODMED_FIRM_PREFIX; // entpmsandbox393
const apiKey = process.env.MODMED_API_KEY;
const username = process.env.MODMED_USERNAME;
const password = process.env.MODMED_PASSWORD;


const instance = axios.create({
baseURL: `${BASE}/${PREFIX}`,
auth: {
username,
password,
},
headers: {
'x-api-key': apiKey,
'Accept': 'application/json'
},
timeout: 15000,
});


export async function searchPatientsModmed(query: string) {
const res = await instance.get(`/v1/patients`, { params: { q: query } });
return res.data;
}


export async function getPatientModmed(id: string) {
const res = await instance.get(`/v1/patients/${id}`);
return res.data;
}


// more wrappers: appointments, notes, meds