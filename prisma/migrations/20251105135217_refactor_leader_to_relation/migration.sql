/*
  Warnings:

  - The values [COMPANY] on the enum `OrganizationsType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `primary_leader` on the `attendees` table. All the data in the column will be lost.
  - The `church_process` column on the `attendees` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ChurchProcess" AS ENUM ('PENDING', 'START_UP_LESSON', 'PRE_ENCOUNTER', 'POST_ENCOUNTER', 'SOL_1', 'SOL_2', 'SOL_3', 'PASTORAL_MINISTRY');

-- AlterEnum
BEGIN;
CREATE TYPE "OrganizationsType_new" AS ENUM ('CHURCH', 'SCHOOL');
ALTER TABLE "organizations" ALTER COLUMN "type" TYPE "OrganizationsType_new" USING ("type"::text::"OrganizationsType_new");
ALTER TYPE "OrganizationsType" RENAME TO "OrganizationsType_old";
ALTER TYPE "OrganizationsType_new" RENAME TO "OrganizationsType";
DROP TYPE "public"."OrganizationsType_old";
COMMIT;

-- AlterTable
ALTER TABLE "attendees" DROP COLUMN "primary_leader",
ADD COLUMN     "primary_leader_id" TEXT,
DROP COLUMN "church_process",
ADD COLUMN     "church_process" "ChurchProcess";

-- AddForeignKey
ALTER TABLE "attendees" ADD CONSTRAINT "attendees_primary_leader_id_fkey" FOREIGN KEY ("primary_leader_id") REFERENCES "attendees"("id") ON DELETE SET NULL ON UPDATE CASCADE;
