const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '../server/.env' });

async function init() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/apex';
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();

  // Create indexes
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  await db.collection('products').createIndex({ name: 'text' });
  await db.collection('orders').createIndex({ createdAt: -1 });
  await db.collection('campaigns').createIndex({ status: 1 });

  // Insert default admin user if not exists
  const adminExists = await db.collection('users').findOne({ email: 'admin@apexdigital.co.za' });
  if (!adminExists) {
    const bcrypt = require('bcryptjs');
    const hashed = await bcrypt.hash('ChangeMe123!', 10);
    await db.collection('users').insertOne({
      name: 'Admin',
      email: 'admin@apexdigital.co.za',
      password: hashed,
      isAdmin: true,
      createdAt: new Date()
    });
    console.log('Default admin created: admin@apexdigital.co.za / ChangeMe123!');
  }

  console.log('Database initialized.');
  await client.close();
}

init().catch(console.error);
