/*
  Warnings:

  - You are about to drop the column `attendance_type_id` on the `attendance` table. All the data in the column will be lost.
  - You are about to drop the `attendance_types` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('RECURRING', 'SPECIAL');

-- DropForeignKey
ALTER TABLE "public"."attendance" DROP CONSTRAINT "attendance_attendance_type_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."attendance_types" DROP CONSTRAINT "attendance_types_event_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."attendance_types" DROP CONSTRAINT "attendance_types_organization_id_fkey";

-- AlterTable
ALTER TABLE "attendance" DROP COLUMN "attendance_type_id";

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "category" "EventCategory" NOT NULL,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "start_date" DROP NOT NULL,
ALTER COLUMN "end_date" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."attendance_types";

-- AlterTable
ALTER TABLE "attendance" DROP COLUMN "hours_worked";