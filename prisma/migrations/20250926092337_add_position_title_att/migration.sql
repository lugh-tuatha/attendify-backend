/*
  Warnings:

  - You are about to drop the column `position` on the `attendees` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."attendees" DROP COLUMN "position",
ADD COLUMN     "position_title" TEXT;
