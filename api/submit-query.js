export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Missing query data' });
  }

  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    return res.status(500).json({ error: 'KV database is not configured or linked in Vercel settings.' });
  }

  try {
    // 1. Fetch current queries from KV
    const getResponse = await fetch(`${url}/`, {
      headers: { Authorization: `Bearer ${token}` },
      method: 'POST',
      body: JSON.stringify(['GET', 'udaan_queries']),
    });
    const getResObj = await getResponse.json();
    const queries = getResObj.result ? JSON.parse(getResObj.result) : [];

    // 2. Append new query
    queries.unshift(query);

    // 3. Save queries back to KV
    const setResponse = await fetch(`${url}/`, {
      headers: { Authorization: `Bearer ${token}` },
      method: 'POST',
      body: JSON.stringify(['SET', 'udaan_queries', JSON.stringify(queries)]),
    });

    const setResult = await setResponse.json();
    if (setResult.error) {
      return res.status(500).json({ error: setResult.error });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
