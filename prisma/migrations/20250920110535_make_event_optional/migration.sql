-- DropForeignKey
ALTER TABLE "public"."attendance_types" DROP CONSTRAINT "attendance_types_event_id_fkey";

-- AlterTable
ALTER TABLE "public"."attendance_types" ALTER COLUMN "event_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."attendance_types" ADD CONSTRAINT "attendance_types_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE SET NULL ON UPDATE CASCADE;
