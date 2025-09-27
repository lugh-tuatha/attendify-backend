/*
  Warnings:

  - You are about to drop the column `hourly_rate` on the `attendees` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."attendance" DROP CONSTRAINT "attendance_attendee_id_fkey";

-- AlterTable
ALTER TABLE "public"."attendance" ADD COLUMN     "event_registration_id" TEXT,
ADD COLUMN     "presence_duration" INTEGER,
ALTER COLUMN "attendee_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."attendees" DROP COLUMN "hourly_rate",
ADD COLUMN     "payroll_id" TEXT,
ADD COLUMN     "salary" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."attendance" ADD CONSTRAINT "attendance_attendee_id_fkey" FOREIGN KEY ("attendee_id") REFERENCES "public"."attendees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."attendance" ADD CONSTRAINT "attendance_event_registration_id_fkey" FOREIGN KEY ("event_registration_id") REFERENCES "public"."event_registrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
