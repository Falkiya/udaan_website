export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Missing query data' });
    }

    const url = process.env.SUPABASE_URL || process.env.STORAGE_URL;
    const token = process.env.SUPABASE_ANON_KEY || process.env.STORAGE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.STORAGE_SERVICE_ROLE_KEY;

    if (!url || !token) {
      return res.status(500).json({ error: 'Supabase database is not configured or linked in Vercel settings.' });
    }

    // 1. Fetch current queries from Supabase
    const getResponse = await fetch(`${url}/rest/v1/website_data?key=eq.udaan_queries&select=value`, {
      headers: {
        'apikey': token,
        'Authorization': `Bearer ${token}`
      },
      method: 'GET'
    });
    const getResData = await getResponse.json();
    const queries = (getResData && getResData[0] && getResData[0].value) ? getResData[0].value : [];

    // 2. Append new query
    queries.unshift(query);

    // 3. Save queries back to Supabase
    const setResponse = await fetch(`${url}/rest/v1/website_data`, {
      headers: {
        'apikey': token,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      method: 'POST',
      body: JSON.stringify({ key: 'udaan_queries', value: queries })
    });

    if (!setResponse.ok) {
      const errText = await setResponse.text();
      return res.status(500).json({ error: `Supabase query submission failed: ${errText}` });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
