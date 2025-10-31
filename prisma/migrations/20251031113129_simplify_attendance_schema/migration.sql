/*
  Warnings:

  - You are about to drop the column `presence_duration` on the `attendance` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."attendance" DROP CONSTRAINT "attendance_attendee_id_fkey";

-- AlterTable
ALTER TABLE "attendance" DROP COLUMN "presence_duration",
ALTER COLUMN "attendee_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_attendee_id_fkey" FOREIGN KEY ("attendee_id") REFERENCES "attendees"("id") ON DELETE SET NULL ON UPDATE CASCADE;
