/*
  Warnings:

  - The values [CONSOLIDATION_PROCESS] on the enum `MemberStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MemberStatus_new" AS ENUM ('FIRST_TIMER', 'SECOND_TIMER', 'THIRD_TIMER', 'FOURTH_TIMER', 'REGULAR_ATTENDEE', 'REGULAR_DISCIPLE', 'REGULAR_STARTUP', 'BACK_TO_LIFE', 'CELL_MEMBER', 'CHILDREN', 'NEWCOMER');
ALTER TABLE "attendees" ALTER COLUMN "member_status" TYPE "MemberStatus_new" USING ("member_status"::text::"MemberStatus_new");
ALTER TYPE "MemberStatus" RENAME TO "MemberStatus_old";
ALTER TYPE "MemberStatus_new" RENAME TO "MemberStatus";
DROP TYPE "public"."MemberStatus_old";
COMMIT;
