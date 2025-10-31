/*
  Warnings:

  - The `member_status` column on the `attendees` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('FIRST_TIMER', 'SECOND_TIMER', 'THIRD_TIMER', 'FOURTH_TIMER', 'REGULAR_ATTENDEE', 'REGULAR_DISCIPLE', 'REGULAR_STARTUP', 'BACK_TO_LIFE', 'CELL_MEMBER', 'CHILDREN');

-- AlterTable
ALTER TABLE "attendees" DROP COLUMN "member_status",
ADD COLUMN     "member_status" "MemberStatus";
