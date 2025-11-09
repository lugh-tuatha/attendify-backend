/*
  Warnings:

  - The `network` column on the `attendees` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `church_hierarchy` column on the `attendees` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `occurance_date` to the `attendance` table without a default value. This is not possible if the table is not empty.
  - Made the column `is_late` on table `attendance` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ChurchHierarchy" AS ENUM ('CELL_MEMBER', 'CELL_LEADER', 'PRIMARY_LEADER', 'ELDER', 'PASTOR', 'BISHOP');

-- CreateEnum
CREATE TYPE "Network" AS ENUM ('CHILDREN', 'YOUTH', 'YOUNG_PRO', 'MOTHER', 'FATHER', 'HUSBAND', 'WIFE');

-- AlterTable
ALTER TABLE "attendance" ADD COLUMN     "occurance_date" TEXT NOT NULL,
ALTER COLUMN "is_late" SET NOT NULL;

-- AlterTable
ALTER TABLE "attendees" DROP COLUMN "network",
ADD COLUMN     "network" "Network",
DROP COLUMN "church_hierarchy",
ADD COLUMN     "church_hierarchy" "ChurchHierarchy";
