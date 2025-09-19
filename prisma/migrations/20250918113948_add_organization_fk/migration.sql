-- CreateEnum
CREATE TYPE "public"."OrganizationsType" AS ENUM ('CHURCH', 'SCHOOL', 'COMPANY');

-- CreateTable
CREATE TABLE "public"."organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."OrganizationsType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "public"."attendees" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "age" INTEGER,
    "email" TEXT,
    "status" TEXT,
    "address" TEXT,
    "birthday" TEXT,
    "facebook_name" TEXT,
    "facebook_link" TEXT,
    "cell_leader" TEXT,
    "network" TEXT,
    "church_hierarchy" TEXT,
    "member_status" TEXT,
    "church_process" TEXT,
    "grade_level" TEXT,
    "section" TEXT,
    "position" TEXT,
    "hourly_rate" INTEGER,
    "department" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "organization_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "organizations_id_key" ON "public"."organizations"("id");

-- CreateIndex
CREATE UNIQUE INDEX "attendees_id_key" ON "public"."attendees"("id");

-- AddForeignKey
ALTER TABLE "public"."attendees" ADD CONSTRAINT "attendees_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
