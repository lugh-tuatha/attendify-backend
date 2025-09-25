-- CreateTable
CREATE TABLE "public"."events" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "organization_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "public"."attendance_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "event_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "public"."attendance" (
    "id" TEXT NOT NULL,
    "time_in" TIMESTAMP(3) NOT NULL,
    "time_out" TIMESTAMP(3) NOT NULL,
    "week_number" INTEGER NOT NULL,
    "attendee_id" TEXT NOT NULL,
    "attendance_type_id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "events_id_key" ON "public"."events"("id");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_types_id_key" ON "public"."attendance_types"("id");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_id_key" ON "public"."attendance"("id");

-- AddForeignKey
ALTER TABLE "public"."events" ADD CONSTRAINT "events_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."attendance_types" ADD CONSTRAINT "attendance_types_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."attendance_types" ADD CONSTRAINT "attendance_types_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."attendance" ADD CONSTRAINT "attendance_attendee_id_fkey" FOREIGN KEY ("attendee_id") REFERENCES "public"."attendees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."attendance" ADD CONSTRAINT "attendance_attendance_type_id_fkey" FOREIGN KEY ("attendance_type_id") REFERENCES "public"."attendance_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."attendance" ADD CONSTRAINT "attendance_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."attendance" ADD CONSTRAINT "attendance_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
