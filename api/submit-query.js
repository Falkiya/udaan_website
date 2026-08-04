import { getDb } from './_mongo.js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Missing query data' });
    }

    const db = await getDb();
    const collection = db.collection('website_data');

    // Prepend the new query directly to the 'value' array in MongoDB
    await collection.updateOne(
      { _id: 'udaan_queries' },
      {
        $push: {
          value: {
            $each: [query],
            $position: 0
          }
        }
      },
      { upsert: true }
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
