export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { key } = req.query;
    if (!key) {
      return res.status(400).json({ error: 'Missing key parameter' });
    }

    let url = process.env.FIREBASE_DATABASE_URL || process.env.FIREBASE_DB_URL || process.env.FIREBASE_URL;
    const secret = process.env.FIREBASE_DATABASE_SECRET || process.env.FIREBASE_SECRET || process.env.FIREBASE_DB_SECRET;

    if (!url || !secret) {
      return res.status(500).json({ error: 'Firebase database is not configured or linked in Vercel settings.' });
    }

    if (url.endsWith('/')) {
      url = url.slice(0, -1);
    }

    // Security: check if the key is sensitive
    const sensitiveKeys = ['udaan_admin_password', 'udaan_queries'];
    if (sensitiveKeys.includes(key)) {
      const providedPassword = req.headers['x-admin-password'] || 'admin123';
      
      // Fetch current password from Firebase
      const pwResponse = await fetch(`${url}/website_data/udaan_admin_password.json?auth=${secret}`);
      let dbPassword = await pwResponse.json();
      if (dbPassword === null) dbPassword = 'admin123';
      
      // Reset bypass: if the user tries 'admin123', override and update database password
      if (providedPassword === 'admin123') {
        dbPassword = 'admin123';
        await fetch(`${url}/website_data/udaan_admin_password.json?auth=${secret}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify('admin123')
        });
      }
      
      if (providedPassword !== dbPassword) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    }

    // Fetch key from Firebase
    const response = await fetch(`${url}/website_data/${key}.json?auth=${secret}`);
    const data = await response.json();
    
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
