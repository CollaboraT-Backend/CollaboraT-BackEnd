/*
  Warnings:

  - You are about to drop the column `name` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the `task_occupations` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `occupationId` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "task_occupations" DROP CONSTRAINT "task_occupations_occupationId_fkey";

-- DropForeignKey
ALTER TABLE "task_occupations" DROP CONSTRAINT "task_occupations_taskId_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_collaboratorAssignedId_fkey";

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "name",
ADD COLUMN     "occupationId" INTEGER NOT NULL,
ADD COLUMN     "title" VARCHAR(255) NOT NULL,
ALTER COLUMN "collaboratorAssignedId" DROP NOT NULL;

-- DropTable
DROP TABLE "task_occupations";

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_occupationId_fkey" FOREIGN KEY ("occupationId") REFERENCES "occupations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_collaboratorAssignedId_fkey" FOREIGN KEY ("collaboratorAssignedId") REFERENCES "collaborators"("id") ON DELETE SET NULL ON UPDATE CASCADE;
