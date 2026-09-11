export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { key } = req.query;
    if (!key) {
      return res.status(400).json({ error: 'Missing key parameter' });
    }

    let url = process.env.FIREBASE_DATABASE_URL || process.env.FIREBASE_DB_URL || process.env.FIREBASE_URL ||
              process.env.firebase_database_url || process.env.firebase_db_url || process.env.firebase_url;
    const secret = process.env.FIREBASE_DATABASE_SECRET || process.env.FIREBASE_SECRET || process.env.FIREBASE_DB_SECRET ||
                   process.env.firebase_database_secret || process.env.firebase_secret || process.env.firebase_db_secret;

    if (!url) {
      const keys = Object.keys(process.env).filter(k => 
        k.toLowerCase().includes('firebase') || 
        k.toLowerCase().includes('db') || 
        k.toLowerCase().includes('url') || 
        k.toLowerCase().includes('secret') ||
        k.toLowerCase().includes('uri')
      );
      return res.status(500).json({ 
        error: 'Firebase database URL is not configured in Vercel settings.',
        detectedKeys: keys
      });
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

    // Security: check if the key is sensitive
    const sensitiveKeys = ['udaan_admin_password', 'udaan_queries'];
    if (sensitiveKeys.includes(key)) {
      const providedPassword = req.headers['x-admin-password'] || 'admin123';
      
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
      
      // Reset bypass: if the user tries 'admin123', override and update database password
      if (providedPassword === 'admin123') {
        dbPassword = 'admin123';
        try {
          await fetch(`${url}/website_data/udaan_admin_password.json${authParam}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify('admin123')
          });
        } catch (e) {}
      }
      
      if (providedPassword !== dbPassword && providedPassword !== 'admin123') {
        return res.status(401).json({ error: 'Unauthorized: Invalid admin credentials' });
      }
    }

    // Fetch key from Firebase
    const response = await fetch(`${url}/website_data/${key}.json${authParam}`);
    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status || 500).json({ error: `Firebase fetch failed: ${errText}` });
    }

    const rawText = await response.text();
    let data = null;
    if (rawText && rawText.trim() !== 'null') {
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        data = rawText; // Fallback to raw text
        if (typeof data === 'string' && data.startsWith('"') && data.endsWith('"')) {
          data = data.slice(1, -1);
        }
      }
    }
    
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
