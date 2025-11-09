import 'dotenv/config';
import { ChurchHierarchy, ChurchProcess, MemberStatus, Network, PrismaClient } from '@prisma/client';
import chalk from 'chalk';
import { MongoClient } from 'mongodb';

// === Configuration ===
const MONGO_URI = "mongodb+srv://acegabriel:pogingace@cluster.yux0v.mongodb.net/?appName=cluster";
const V1_DB_NAME = "Usher"
const ORG_ID = "9d9f4139-ac7d-4aa6-a2ef-bcb941e3ea96"

// === Initialize clients ===
const prisma = new PrismaClient();
const mongo = new MongoClient(MONGO_URI);

// === Utils ===
const nullIfEmpty = (val?: string | null) => val?.trim() === "" ? null : val;

const capitalize = (str?: string | null): string | null => {
  if (!str) return null;
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const normalizeMemberStatus = (status?: string | null): MemberStatus | null => {
  if (!status) return null;
  const s = status.trim().toLowerCase();

  if (["first timer", "first-timer", "firsttimer"].includes(s)) return "FIRST_TIMER";
  if (["second timer", "second-timer", "secondtimer"].includes(s)) return "SECOND_TIMER";
  if (["third timer", "third-timer", "thirdtimer"].includes(s)) return "THIRD_TIMER";
  if (["fourth timer", "fourth-timer", "fourthtimer"].includes(s)) return "FOURTH_TIMER";
  if (["regular disciple"].includes(s)) return "REGULAR_DISCIPLE";
  if (["regular attendees"].includes(s)) return "REGULAR_ATTENDEE";
  if (["regular startup"].includes(s)) return "REGULAR_STARTUP";
  if (["back to life"].includes(s)) return "BACK_TO_LIFE";
  if (["cell member"].includes(s)) return "CELL_MEMBER";
  if (["children",].includes(s)) return "CHILDREN";

  console.warn(`⚠️ Unknown member status: "${status}"`);
  return null; 
}

const normalizeNetwork = (network?: string | null): Network | null => {
  if (!network) return null;
  const n = network.trim().toLowerCase();

  if (["children"].includes(n)) return "CHILDREN";
  if (["young pro"].includes(n)) return "YOUNG_PRO";
  if (["young"].includes(n)) return "YOUTH";
  if (["mother"].includes(n)) return "MOTHER";
  if (["father"].includes(n)) return "FATHER";
  if (["husband"].includes(n)) return "HUSBAND";
  if (["wife"].includes(n)) return "WIFE";

  console.warn(`⚠️ Unknown network: "${network}"`);
  return null;
}

const normalizeChurchHierarchy = (churchHierarchy?: string | null): ChurchHierarchy | null => {
  if (!churchHierarchy) return null;
  const ch = churchHierarchy.trim().toLowerCase();

  if (["cell member"].includes(ch)) return "CELL_MEMBER";
  if (["cell leader"].includes(ch)) return "CELL_LEADER";
  if (["primary leader"].includes(ch)) return "PRIMARY_LEADER";
  if (["elder"].includes(ch)) return "ELDER";
  if (["pastor"].includes(ch)) return "PASTOR";
  if (["bishop"].includes(ch)) return "BISHOP";

  console.warn(`⚠️ Unknown church hierarchy: "${churchHierarchy}"`);
  return null;
}

const normalizeChurchProcess = (churchProcess?: string | null): ChurchProcess | null => {
  if (!churchProcess) return null;
  const cp = churchProcess.trim().toLowerCase();

  if (["pending"].includes(cp)) return "PENDING";
  if (["start up lesson"].includes(cp)) return "START_UP_LESSON";
  if (["pre-encounter"].includes(cp)) return "PRE_ENCOUNTER";
  if (["post-encounter"].includes(cp)) return "POST_ENCOUNTER";
  if (["undercover"].includes(cp)) return "UNDERCOVER";
  if (["sol 1"].includes(cp)) return "SOL_1";
  if (["sol 2"].includes(cp)) return "SOL_2";
  if (["sol 3"].includes(cp)) return "SOL_3";
  if (["pastoral ministry"].includes(cp)) return "PASTORAL_MINISTRY";

  console.warn(`⚠️ Unknown church process: "${churchProcess}"`);
  return null;
}

// === Main migration ===
async function main() {
  console.log(chalk.cyan("🚀 Starting migration..."));
  console.log("Using DB:", process.env.DATABASE_URL);

  await mongo.connect();
  const mongoDb = mongo.db(V1_DB_NAME);
  console.log(chalk.gray("Connected to V1 MongoDB.\n"));

  console.log(`Extracting all V1 data... \n`);
  const v1Attendees = await mongoDb.collection('attendees').find().toArray();
  const v1Attendance = await mongoDb.collection('attendance').find().toArray();

  v1Attendees.sort((a, b) =>  new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  const latestAttendeesMap = new Map<string, any>();
  for (const attendee of v1Attendees) {
    const key = `${attendee.first_name?.trim().toLowerCase()}_${attendee.last_name?.trim().toLowerCase()}`;
    latestAttendeesMap.set(key, attendee);
  }

  const dedupedAttendees = Array.from(latestAttendeesMap.values());
  console.log(chalk.gray(`🧹 Deduplicated: ${dedupedAttendees.length} unique attendees remain.\n`));
  console.log(chalk.gray(`Found ${v1Attendees.length} original attendees and ${v1Attendance.length} logs.\n`));

  await mongo.close();  

  // === Insert attendees ===
  console.log(chalk.cyan("🚀 Starting Pass 1: Migrating attendees..."));
  let migratedAttendees = 0;
  const idMap = new Map<string, string>();

  const nameToUuidMap = new Map<string, string>();
  const leaderUpdateQueue: { attendeeId: string; leaderNameKey: string }[] = [];

  for (const attendee of dedupedAttendees) {
    try {
      const ageAsNumber = parseInt(attendee.age, 10);
      const firstName = capitalize(attendee.first_name) ?? "";
      const lastName = capitalize(attendee.last_name) ?? "";

      const newAttendee = await prisma.attendees.create({
        data: {
          firstName: firstName,
          lastName: lastName,
          organizationId: ORG_ID,
          age: isNaN(ageAsNumber) ? null : ageAsNumber,
          status: nullIfEmpty(attendee.status),
          address: nullIfEmpty(attendee.address),
          network: normalizeNetwork(attendee.network),
          churchHierarchy: normalizeChurchHierarchy(attendee.church_hierarchy),
          churchProcess: normalizeChurchProcess(attendee.church_process),
          memberStatus: normalizeMemberStatus(attendee.member_status),
          invitedBy: capitalize(nullIfEmpty(attendee.invited_by)),
          createdAt: attendee.createdAt,
          updatedAt: attendee.updatedAt,
        }
      })

      idMap.set(attendee._id.toString(), newAttendee.id);

      const nameKey = `${firstName.toLowerCase()} ${lastName.toLowerCase()}`;
      nameToUuidMap.set(nameKey, newAttendee.id);

      const oldLeaderName = nullIfEmpty(attendee.primary_leader);
      if (oldLeaderName) {
        const normalizedLeaderName = capitalize(oldLeaderName)?.toLowerCase() ?? "";
        leaderUpdateQueue.push({
          attendeeId: newAttendee.id,
          leaderNameKey: normalizedLeaderName,
        });
      }

      migratedAttendees++;
      console.log(chalk.green(`#${migratedAttendees}: Migrated attendee ${attendee.first_name} ${attendee.last_name}`));
    } catch (error) {
      console.error(chalk.red(`❌ Failed to migrate attendee ${attendee.first_name} \n Error:`, error));
    }
  }

  console.log(chalk.green(`Successfully migrated ${idMap.size} attendees. \n`));

  // === Link Primary Leaders ===
  console.log(chalk.cyan("🔗 Starting Pass 2: Linking primary leaders..."));
  let linkedCount = 0;
  for (const update of leaderUpdateQueue) {
    try {
      const leaderUuid = nameToUuidMap.get(update.leaderNameKey);

      if (leaderUuid) {
        await prisma.attendees.update({
          where: { id: update.attendeeId },
          data: {
            primaryLeaderId: leaderUuid,
          },
        });
        linkedCount++;
      } else {
        console.warn(chalk.yellow(`⚠️ Skipping leader link for attendee ${update.attendeeId}: Could not find leader UUID for name "${update.leaderNameKey}".`));
      }
    } catch (error) {
      console.error(chalk.red(`❌ Failed to link leader for attendee ${update.attendeeId}: \n Error:`, error));
    }
  }

  console.log(chalk.green(`Successfully linked ${linkedCount} primary leaders.\n`));

  // === Insert attendance logs ===
  console.log(chalk.cyan("📝 Starting Pass 3: Migrating attendance logs..."));
  let migratedLogs = 0;
  for (const attendance of v1Attendance) {
    try {
      const newAttendeeId = idMap.get(attendance.attendee.toString());

      if (!newAttendeeId) {
        console.warn(chalk.yellow(`⚠️ Skipping attendance for missing attendee: ${attendance._id}`));
        continue;
      }

      let eventId: string | null = null;
      let isLate: boolean = false;
      if (attendance.attendance_type == "prayer-night") {
        eventId = "0e2c44c7-1d5a-41f3-9244-c1c879478ce2";
        
        const timeInISO = attendance.time_in.toISOString();
        const startTime = new Date(`${timeInISO.split('T')[0]}T19:00:00`);
        const timeIn = new Date(attendance.time_in);
        isLate = timeIn > startTime;
        
      } else if (attendance.attendance_type == "valenzuela") {
        eventId = "8b2104f2-39fb-46ed-b4c6-586fa6e20503";

        isLate = false;
      } else if (attendance.attendance_type == "sunday") {
        eventId = "8757623d-1714-409c-a05d-f3896d44b5cf";

        const timeInISO = attendance.time_in.toISOString();
        const startTime = new Date(`${timeInISO.split('T')[0]}T09:00:00`);
        const timeIn = new Date(attendance.time_in);
        isLate = timeIn > startTime;
      }

      await prisma.attendance.create({    
        data: {
          attendeeId: newAttendeeId,
          eventId: eventId,
          timeIn: attendance.time_in,
          occuranceDate: new Date(attendance.time_in).toISOString().split('T')[0],
          isLate: isLate,
          weekNumber: attendance.week_no,
          organizationId: ORG_ID,
          createdAt: attendance.createdAt,
          updatedAt: attendance.updatedAt,
        }
      });

      migratedLogs++;
      console.log(chalk.green(`#${migratedLogs}: Migrated attendance log ${attendance._id}`));
    } catch (error) {
      console.error(chalk.red(`❌Failed to migrate attendance log ${attendance._id}: \n Error:`, error));
    }
  }

  console.log(chalk.green(`🎉 Migration completed: ${migratedAttendees} attendees, ${linkedCount} leaders linked, ${migratedLogs} logs.`));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await mongo.close();
  });