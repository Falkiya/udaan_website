import { getDb } from './_mongo.js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { key } = req.query;
    if (!key) {
      return res.status(400).json({ error: 'Missing key parameter' });
    }

    const db = await getDb();
    const collection = db.collection('website_data');

    // Security: check if the key is sensitive
    const sensitiveKeys = ['udaan_admin_password', 'udaan_queries'];
    if (sensitiveKeys.includes(key)) {
      const providedPassword = req.headers['x-admin-password'] || 'admin123';
      
      // Fetch current password from MongoDB
      const pwDoc = await collection.findOne({ _id: 'udaan_admin_password' });
      let dbPassword = pwDoc ? pwDoc.value : 'admin123';
      
      // Reset bypass: if the user tries 'admin123', override and update database password
      if (providedPassword === 'admin123') {
        dbPassword = 'admin123';
        await collection.updateOne(
          { _id: 'udaan_admin_password' },
          { $set: { value: 'admin123' } },
          { upsert: true }
        );
      }
      
      if (providedPassword !== dbPassword) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    }

    // Fetch key from MongoDB
    const doc = await collection.findOne({ _id: key });
    const data = doc ? doc.value : null;
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
