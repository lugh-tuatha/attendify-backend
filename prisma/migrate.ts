import { PrismaClient } from '@prisma/client';
import { MongoClient } from 'mongodb';

const MONGO_URI = "mongodb+srv://acegabriel:pogingace@cluster.yux0v.mongodb.net/?appName=cluster";
const V1_DB_NAME = "Usher"

const prisma = new PrismaClient();
const mongoClient = new MongoClient(MONGO_URI);

const idMap = new Map<string, number>();

async function main() {
  console.log('Connecting to V1 MongoDB...');
  await mongoClient.connect();
  const mongoDb = mongoClient.db(V1_DB_NAME);

  console.log('Extracting all V1 data...');
  const v1Attendees = await mongoDb.collection('attendees').find().toArray();

  console.log(`Found ${v1Attendees.length} attendees`);
  await mongoClient.close();

  // console.log('Migrating Attendees...');
  // for (const attendee of v1Attendees) {
  //   try {
  //     const newAttendee = await prisma.attendees.create({

  //     })
  //   } catch (error) {
      
  //   }
  // }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });