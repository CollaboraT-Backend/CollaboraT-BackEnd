/*
  Warnings:

  - You are about to drop the column `projectId` on the `project_teams` table. All the data in the column will be lost.
  - Added the required column `projectId` to the `team_collaborators` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "project_teams" DROP CONSTRAINT "project_teams_projectId_fkey";

-- DropForeignKey
ALTER TABLE "team_collaborators" DROP CONSTRAINT "team_collaborators_teamId_fkey";

-- AlterTable
ALTER TABLE "project_teams" DROP COLUMN "projectId";

-- AlterTable
ALTER TABLE "team_collaborators" ADD COLUMN     "projectId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "team_collaborators" ADD CONSTRAINT "team_collaborators_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
