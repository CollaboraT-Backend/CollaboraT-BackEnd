-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_collaboratorAssignedId_fkey";

-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "collaboratorAssignedId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_collaboratorAssignedId_fkey" FOREIGN KEY ("collaboratorAssignedId") REFERENCES "collaborators"("id") ON DELETE SET NULL ON UPDATE CASCADE;
