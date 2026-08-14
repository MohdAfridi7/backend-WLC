const mongoose = require("mongoose");
require("dotenv").config();

// ===============================
// OLD DATABASE
// ===============================
const OLD_DB_URI = "mongodb://sanisaifi786_db_user:wudAWRyss3meaEpg@ac-43iys4z-shard-00-00.g2yeeim.mongodb.net:27017,ac-43iys4z-shard-00-01.g2yeeim.mongodb.net:27017,ac-43iys4z-shard-00-02.g2yeeim.mongodb.net:27017/WLC-Backend?ssl=true&replicaSet=atlas-14d3hg-shard-0&authSource=admin&retryWrites=true&w=majority";

// ===============================
// NEW DATABASE
// ===============================
const NEW_DB_URI = "mongodb://WLC:WLC12345@ac-qhqe864-shard-00-00.jvx5rfm.mongodb.net:27017,ac-qhqe864-shard-00-01.jvx5rfm.mongodb.net:27017,ac-qhqe864-shard-00-02.jvx5rfm.mongodb.net:27017/WLC-Backend?ssl=true&replicaSet=atlas-8attrc-shard-0&authSource=admin&appName=WLC";

async function migrateDatabase() {
  let oldConnection;
  let newConnection;

  try {
    console.log("🔌 Connecting to OLD database...");

    oldConnection = await mongoose.createConnection(OLD_DB_URI).asPromise();

    console.log("✅ OLD database connected");

    console.log("🔌 Connecting to NEW database...");

    newConnection = await mongoose.createConnection(NEW_DB_URI).asPromise();

    console.log("✅ NEW database connected");

    const oldDb = oldConnection.db;
    const newDb = newConnection.db;

    // Get all collections from old database
    const collections = await oldDb.listCollections().toArray();

    console.log(`\n📦 Found ${collections.length} collections\n`);

    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;

      console.log(`================================`);
      console.log(`📁 Collection: ${collectionName}`);
      console.log(`================================`);

      const oldCollection = oldDb.collection(collectionName);
      const newCollection = newDb.collection(collectionName);

      // Get all documents
      const documents = await oldCollection.find({}).toArray();

      console.log(`📄 Documents: ${documents.length}`);

      if (documents.length === 0) {
        console.log("⚠️ Empty collection, skipping...");
        continue;
      }

      // Insert documents in batches
      const BATCH_SIZE = 500;

      for (let i = 0; i < documents.length; i += BATCH_SIZE) {
        const batch = documents.slice(i, i + BATCH_SIZE);

        await newCollection.insertMany(batch);

        console.log(
          `✅ ${Math.min(
            i + BATCH_SIZE,
            documents.length
          )}/${documents.length} inserted`
        );
      }

      console.log(`🎉 ${collectionName} completed\n`);
    }

    console.log("========================================");
    console.log("🎉 DATABASE MIGRATION COMPLETED");
    console.log("========================================");
  } catch (error) {
    console.error("\n❌ MIGRATION ERROR:");
    console.error(error);
  } finally {
    if (oldConnection) {
      await oldConnection.close();
    }

    if (newConnection) {
      await newConnection.close();
    }

    console.log("🔌 Connections closed");
  }
}

migrateDatabase();