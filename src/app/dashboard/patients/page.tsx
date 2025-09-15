import React, { useState } from 'react';


export default function PatientsPage() {
const [q, setQ] = useState('');
const [loading, setLoading] = useState(false);
const [res, setRes] = useState<any>(null);


async function doSearch(e?: React.FormEvent) {
e?.preventDefault();
setLoading(true);
const r = await fetch('/api/patients/search?q=' + encodeURIComponent(q));
const j = await r.json();
setRes(j);
setLoading(false);
}


return (
<div className="p-6">
<h1 className="text-2xl">Patient Search</h1>
<form onSubmit={doSearch} className="flex gap-2 mt-4">
<input value={q} onChange={e=>setQ(e.target.value)} className="border p-2" placeholder="name / id" />
<button className="px-4 py-2 bg-blue-600 text-white">Search</button>
</form>


{loading && <div>Loading…</div>}


{res && (
<div className="mt-4 grid grid-cols-2 gap-4">
<div>
<h2 className="font-bold">ModMed Results</h2>
<pre className="whitespace-pre-wrap">{JSON.stringify(res.modmed, null, 2)}</pre>
</div>
<div>
<h2 className="font-bold">Athena Results</h2>
<pre className="whitespace-pre-wrap">{JSON.stringify(res.athena, null, 2)}</pre>
</div>
</div>
)}
</div>
);
}