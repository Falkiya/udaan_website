export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { key } = req.query;
    if (!key) {
      return res.status(400).json({ error: 'Missing key parameter' });
    }

    const url = process.env.SUPABASE_URL || process.env.STORAGE_URL;
    const token = process.env.SUPABASE_ANON_KEY || process.env.STORAGE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.STORAGE_SERVICE_ROLE_KEY;

    if (!url || !token) {
      return res.status(500).json({ error: 'Supabase database is not configured or linked in Vercel settings.' });
    }

    // Security: check if the key is sensitive
    const sensitiveKeys = ['udaan_admin_password', 'udaan_queries'];
    if (sensitiveKeys.includes(key)) {
      const providedPassword = req.headers['x-admin-password'] || 'admin123';
      
      // Fetch current password from Supabase
      const pwResponse = await fetch(`${url}/rest/v1/website_data?key=eq.udaan_admin_password&select=value`, {
        headers: {
          'apikey': token,
          'Authorization': `Bearer ${token}`
        },
        method: 'GET'
      });
      const pwData = await pwResponse.json();
      const dbPassword = (pwData && pwData[0] && pwData[0].value) ? pwData[0].value : 'admin123';
      
      if (providedPassword !== dbPassword) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    }

    // Fetch key from Supabase
    const response = await fetch(`${url}/rest/v1/website_data?key=eq.${key}&select=value`, {
      headers: {
        'apikey': token,
        'Authorization': `Bearer ${token}`
      },
      method: 'GET'
    });

    const result = await response.json();
    const data = (result && result[0] && result[0].value) ? result[0].value : null;
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
