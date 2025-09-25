-- CreateTable
CREATE TABLE "public"."EventRegistrations" (
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
CREATE UNIQUE INDEX "EventRegistrations_id_key" ON "public"."EventRegistrations"("id");

-- AddForeignKey
ALTER TABLE "public"."EventRegistrations" ADD CONSTRAINT "EventRegistrations_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventRegistrations" ADD CONSTRAINT "EventRegistrations_attendee_id_fkey" FOREIGN KEY ("attendee_id") REFERENCES "public"."attendees"("id") ON DELETE SET NULL ON UPDATE CASCADE;
