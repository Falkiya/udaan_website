export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Missing query data' });
    }

    let url = process.env.FIREBASE_DATABASE_URL || process.env.FIREBASE_DB_URL || process.env.FIREBASE_URL ||
              process.env.firebase_database_url || process.env.firebase_db_url || process.env.firebase_url;
    const secret = process.env.FIREBASE_DATABASE_SECRET || process.env.FIREBASE_SECRET || process.env.FIREBASE_DB_SECRET ||
                   process.env.firebase_database_secret || process.env.firebase_secret || process.env.firebase_db_secret;

    if (!url || !secret) {
      return res.status(500).json({ error: 'Firebase database is not configured or linked in Vercel settings.' });
    }

    if (url.endsWith('/')) {
      url = url.slice(0, -1);
    }

    // 1. Fetch current queries from Firebase
    const getResponse = await fetch(`${url}/website_data/udaan_queries.json?auth=${secret}`);
    const queries = await getResponse.json() || [];

    // 2. Append new query to the front
    queries.unshift(query);

    // 3. Save queries back to Firebase
    const setResponse = await fetch(`${url}/website_data/udaan_queries.json?auth=${secret}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(queries)
    });

    if (!setResponse.ok) {
      const errText = await setResponse.text();
      return res.status(500).json({ error: `Firebase query submission failed: ${errText}` });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
