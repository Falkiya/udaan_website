export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { key, data } = req.body;
    if (!key || data === undefined) {
      return res.status(400).json({ error: 'Missing key or data' });
    }

    const url = process.env.SUPABASE_URL || process.env.STORAGE_URL;
    const token = process.env.SUPABASE_ANON_KEY || process.env.STORAGE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.STORAGE_SERVICE_ROLE_KEY;

    if (!url || !token) {
      return res.status(500).json({ error: 'Supabase database is not configured or linked in Vercel settings.' });
    }

    const providedPassword = req.headers['x-admin-password'] || 'admin123';

    // 1. Fetch current password from DB
    const pwResponse = await fetch(`${url}/rest/v1/website_data?key=eq.udaan_admin_password&select=value`, {
      headers: {
        'apikey': token,
        'Authorization': `Bearer ${token}`
      },
      method: 'GET'
    });
    const pwData = await pwResponse.json();
    const dbPassword = (pwData && pwData[0] && pwData[0].value) ? pwData[0].value : 'admin123';

    // 2. Validate password
    if (providedPassword !== dbPassword) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // 3. Upsert key/value in Supabase
    const response = await fetch(`${url}/rest/v1/website_data`, {
      headers: {
        'apikey': token,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      method: 'POST',
      body: JSON.stringify({ key, value: data })
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(500).json({ error: `Supabase save failed: ${errText}` });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
