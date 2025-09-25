/*
  Warnings:

  - You are about to drop the `EventRegistrations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."EventRegistrations" DROP CONSTRAINT "EventRegistrations_attendee_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."EventRegistrations" DROP CONSTRAINT "EventRegistrations_event_id_fkey";

-- DropTable
DROP TABLE "public"."EventRegistrations";

-- CreateTable
CREATE TABLE "public"."event_registrations" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "attendee_id" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "invited_bby" TEXT,
    "primary_leader" TEXT,
    "member_status" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "event_registrations_id_key" ON "public"."event_registrations"("id");

-- AddForeignKey
ALTER TABLE "public"."event_registrations" ADD CONSTRAINT "event_registrations_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."event_registrations" ADD CONSTRAINT "event_registrations_attendee_id_fkey" FOREIGN KEY ("attendee_id") REFERENCES "public"."attendees"("id") ON DELETE SET NULL ON UPDATE CASCADE;
