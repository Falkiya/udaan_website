export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { key } = req.query;
  if (!key) {
    return res.status(400).json({ error: 'Missing key parameter' });
  }

  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    return res.status(500).json({ error: 'KV database is not configured or linked in Vercel settings.' });
  }

  // Security: check if the key is sensitive
  const sensitiveKeys = ['udaan_admin_password', 'udaan_queries'];
  if (sensitiveKeys.includes(key)) {
    const providedPassword = req.headers['x-admin-password'] || 'admin123';
    
    // Fetch current password from DB to compare
    const pwResponse = await fetch(`${url}/`, {
      headers: { Authorization: `Bearer ${token}` },
      method: 'POST',
      body: JSON.stringify(['GET', 'udaan_admin_password']),
    });
    const pwResObj = await pwResponse.json();
    const dbPassword = pwResObj.result ? JSON.parse(pwResObj.result) : 'admin123';
    
    if (providedPassword !== dbPassword) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  try {
    const response = await fetch(`${url}/`, {
      headers: { Authorization: `Bearer ${token}` },
      method: 'POST',
      body: JSON.stringify(['GET', key]),
    });

    const result = await response.json();
    const data = result.result ? JSON.parse(result.result) : null;
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
