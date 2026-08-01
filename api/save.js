export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { key, data } = req.body;
  if (!key || data === undefined) {
    return res.status(400).json({ error: 'Missing key or data' });
  }

  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    return res.status(500).json({ error: 'KV database is not configured or linked in Vercel settings.' });
  }

  const providedPassword = req.headers['x-admin-password'] || 'admin123';

  try {
    // 1. Fetch current password from DB
    const pwResponse = await fetch(`${url}/`, {
      headers: { Authorization: `Bearer ${token}` },
      method: 'POST',
      body: JSON.stringify(['GET', 'udaan_admin_password']),
    });
    const pwResObj = await pwResponse.json();
    const dbPassword = pwResObj.result ? JSON.parse(pwResObj.result) : 'admin123';

    // 2. Validate password
    if (providedPassword !== dbPassword) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // 3. Write key/value to Vercel KV
    const response = await fetch(`${url}/`, {
      headers: { Authorization: `Bearer ${token}` },
      method: 'POST',
      body: JSON.stringify(['SET', key, JSON.stringify(data)]),
    });

    const result = await response.json();
    if (result.error) {
      return res.status(500).json({ error: result.error });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
