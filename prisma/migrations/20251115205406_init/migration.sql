CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateEnum
CREATE TYPE "OrganizationsType" AS ENUM ('CHURCH', 'SCHOOL');

-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('RECURRING', 'SPECIAL');

-- CreateEnum
CREATE TYPE "ChurchHierarchy" AS ENUM ('CELL_MEMBER', 'CELL_LEADER', 'PRIMARY_LEADER', 'ELDER', 'PASTOR', 'BISHOP');

-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('FIRST_TIMER', 'SECOND_TIMER', 'THIRD_TIMER', 'FOURTH_TIMER', 'REGULAR_ATTENDEE', 'REGULAR_DISCIPLE', 'REGULAR_STARTUP', 'BACK_TO_LIFE', 'CELL_MEMBER', 'CHILDREN', 'NEWCOMER');

-- CreateEnum
CREATE TYPE "ChurchProcess" AS ENUM ('PENDING', 'START_UP_LESSON', 'PRE_ENCOUNTER', 'POST_ENCOUNTER', 'SOL_1', 'SOL_2', 'SOL_3', 'PASTORAL_MINISTRY', 'UNDERCOVER');

-- CreateEnum
CREATE TYPE "Network" AS ENUM ('CHILDREN', 'YOUTH', 'YOUNG_PRO', 'MOTHER', 'FATHER', 'HUSBAND', 'WIFE');

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "OrganizationsType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendees" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "embedding" vector,
    "age" INTEGER,
    "email" TEXT,
    "status" TEXT,
    "address" TEXT,
    "birthday" TEXT,
    "facebook_name" TEXT,
    "facebook_link" TEXT,
    "cell_leader" TEXT,
    "grade_level" TEXT,
    "section" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "organization_id" TEXT NOT NULL,
    "member_status" "MemberStatus",
    "network" "Network",
    "church_hierarchy" "ChurchHierarchy",
    "primary_leader_id" TEXT,
    "church_process" "ChurchProcess",
    "invited_by" TEXT,
    "reference_image_url" TEXT,
    "is_archived" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "attendees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "organization_id" TEXT NOT NULL,
    "category" "EventCategory" NOT NULL,
    "slug" TEXT NOT NULL,
    "is_archived" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance" (
    "id" TEXT NOT NULL,
    "time_in" TIMESTAMP(3) NOT NULL,
    "time_out" TIMESTAMP(3),
    "week_number" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "attendee_id" TEXT,
    "event_registration_id" TEXT,
    "event_id" TEXT,
    "organization_id" TEXT NOT NULL,
    "is_late" BOOLEAN NOT NULL,
    "occurance_date" TEXT NOT NULL,

    CONSTRAINT "attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_registrations" (
    "id" TEXT NOT NULL,
    "invited_by" TEXT,
    "event_id" TEXT NOT NULL,
    "attendee_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "attendees_first_name_last_name_key" ON "attendees"("first_name", "last_name");

-- CreateIndex
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "event_registrations_attendee_id_event_id_key" ON "event_registrations"("attendee_id", "event_id");

-- AddForeignKey
ALTER TABLE "attendees" ADD CONSTRAINT "attendees_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendees" ADD CONSTRAINT "attendees_primary_leader_id_fkey" FOREIGN KEY ("primary_leader_id") REFERENCES "attendees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_attendee_id_fkey" FOREIGN KEY ("attendee_id") REFERENCES "attendees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_event_registration_id_fkey" FOREIGN KEY ("event_registration_id") REFERENCES "event_registrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_attendee_id_fkey" FOREIGN KEY ("attendee_id") REFERENCES "attendees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
