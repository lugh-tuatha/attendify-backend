-- DropForeignKey
ALTER TABLE "public"."attendance" DROP CONSTRAINT "attendance_event_id_fkey";

-- AlterTable
ALTER TABLE "public"."attendance" ALTER COLUMN "event_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."attendance" ADD CONSTRAINT "attendance_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE SET NULL ON UPDATE CASCADE;
