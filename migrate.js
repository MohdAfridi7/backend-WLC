const { MongoClient } = require("mongodb");

const OLD_URI = "YOUR_OLD_URI";
const NEW_URI = "YOUR_NEW_URI";

async function migrate() {
  const oldClient = new MongoClient(OLD_URI);
  const newClient = new MongoClient(NEW_URI);

  try {
    console.log("Connecting to OLD MongoDB...");
    await oldClient.connect();

    console.log("Connecting to NEW MongoDB...");
    await newClient.connect();

    const oldDb = oldClient.db("WLC-Backend");
    const newDb = newClient.db("WLC-Backend");

    const collections = await oldDb.listCollections().toArray();

    console.log(`Found ${collections.length} collections.`);

    for (const collectionInfo of collections) {
      const name = collectionInfo.name;

      console.log(`\nMigrating: ${name}`);

      const oldCollection = oldDb.collection(name);
      const newCollection = newDb.collection(name);

      const documents = await oldCollection.find({}).toArray();

      if (documents.length === 0) {
        console.log(`${name}: empty`);
        continue;
      }

      await newCollection.deleteMany({});
      await newCollection.insertMany(documents);

      console.log(`${name}: ${documents.length} documents copied`);
    }

    console.log("\n✅ MIGRATION COMPLETE!");
  } catch (error) {
    console.error("\n❌ Migration failed:");
    console.error(error);
  } finally {
    await oldClient.close();
    await newClient.close();
  }
}

migrate();