-- DropForeignKey
ALTER TABLE "public"."attendees" DROP CONSTRAINT "attendees_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."attendees" DROP CONSTRAINT "attendees_primary_leader_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."events" DROP CONSTRAINT "events_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."attendance" DROP CONSTRAINT "attendance_attendee_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."attendance" DROP CONSTRAINT "attendance_event_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."attendance" DROP CONSTRAINT "attendance_event_registration_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."attendance" DROP CONSTRAINT "attendance_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."event_registrations" DROP CONSTRAINT "event_registrations_attendee_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."event_registrations" DROP CONSTRAINT "event_registrations_event_id_fkey";

-- DropTable
DROP TABLE "public"."organizations";

-- DropTable
DROP TABLE "public"."attendees";

-- DropTable
DROP TABLE "public"."events";

-- DropTable
DROP TABLE "public"."attendance";

-- DropTable
DROP TABLE "public"."event_registrations";

-- DropEnum
DROP TYPE "public"."OrganizationsType";

-- DropEnum
DROP TYPE "public"."EventCategory";

-- DropEnum
DROP TYPE "public"."ChurchHierarchy";

-- DropEnum
DROP TYPE "public"."MemberStatus";

-- DropEnum
DROP TYPE "public"."ChurchProcess";

-- DropEnum
DROP TYPE "public"."Network";

