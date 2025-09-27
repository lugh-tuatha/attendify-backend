/*
  Warnings:

  - A unique constraint covering the columns `[first_name,last_name]` on the table `attendees` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[first_name,last_name]` on the table `event_registrations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "attendees_first_name_last_name_key" ON "public"."attendees"("first_name", "last_name");

-- CreateIndex
CREATE UNIQUE INDEX "event_registrations_first_name_last_name_key" ON "public"."event_registrations"("first_name", "last_name");
