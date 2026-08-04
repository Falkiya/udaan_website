import { getDb } from './_mongo.js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { key, data } = req.body;
    if (!key || data === undefined) {
      return res.status(400).json({ error: 'Missing key or data' });
    }

    const db = await getDb();
    const collection = db.collection('website_data');

    const providedPassword = req.headers['x-admin-password'] || 'admin123';

    // 1. Fetch current password from MongoDB
    const pwDoc = await collection.findOne({ _id: 'udaan_admin_password' });
    const dbPassword = pwDoc ? pwDoc.value : 'admin123';

    // 2. Validate password
    if (providedPassword !== dbPassword) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // 3. Upsert key/value in MongoDB
    await collection.updateOne(
      { _id: key },
      { $set: { value: data } },
      { upsert: true }
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
