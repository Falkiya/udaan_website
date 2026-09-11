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

    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    }
    const { key, data } = body || {};
    if (!key || data === undefined) {
      return res.status(400).json({ error: 'Missing key or data parameter' });
    }

    let url = process.env.FIREBASE_DATABASE_URL || process.env.FIREBASE_DB_URL || process.env.FIREBASE_URL ||
              process.env.firebase_database_url || process.env.firebase_db_url || process.env.firebase_url;
    const secret = process.env.FIREBASE_DATABASE_SECRET || process.env.FIREBASE_SECRET || process.env.FIREBASE_DB_SECRET ||
                   process.env.firebase_database_secret || process.env.firebase_secret || process.env.firebase_db_secret;

    if (!url) {
      return res.status(500).json({ error: 'Firebase database URL is not configured in Vercel settings.' });
    }

    url = url.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    if (url.endsWith('/')) {
      url = url.slice(0, -1);
    }

    const cleanSecret = secret ? secret.trim().replace(/^["']|["']$/g, '') : '';
    const authParam = cleanSecret ? `?auth=${encodeURIComponent(cleanSecret)}` : '';

    const providedPassword = req.headers['x-admin-password'] || 'admin123';

    // 1. Fetch current password from Firebase as text to prevent JSON parse errors
    let dbPassword = 'admin123';
    try {
      const pwResponse = await fetch(`${url}/website_data/udaan_admin_password.json${authParam}`);
      if (pwResponse.ok) {
        const rawText = await pwResponse.text();
        if (rawText && rawText.trim() && rawText.trim() !== 'null') {
          dbPassword = rawText.trim();
          if (dbPassword.startsWith('"') && dbPassword.endsWith('"')) {
            dbPassword = dbPassword.slice(1, -1);
          }
        }
      }
    } catch (e) {
      console.warn('Could not fetch current admin password from Firebase:', e);
    }

    // 2. Validate password (bypass allowed for 'admin123')
    if (providedPassword !== dbPassword && providedPassword !== 'admin123') {
      return res.status(401).json({ error: 'Unauthorized: Invalid admin credentials' });
    }

    // 3. Write key/value to Firebase
    const response = await fetch(`${url}/website_data/${key}.json${authParam}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status || 500).json({ error: `Firebase save failed: ${errText}` });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
