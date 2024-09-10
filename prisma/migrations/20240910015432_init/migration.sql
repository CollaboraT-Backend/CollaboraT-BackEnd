/*
  Warnings:

  - You are about to drop the `Collaborator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Entity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Occupation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProfilePicture` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectTeam` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TaskComment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TaskOccupation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeamCollaborator` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Collaborator" DROP CONSTRAINT "Collaborator_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Collaborator" DROP CONSTRAINT "Collaborator_occupationId_fkey";

-- DropForeignKey
ALTER TABLE "Permission" DROP CONSTRAINT "Permission_entityId_fkey";

-- DropForeignKey
ALTER TABLE "ProfilePicture" DROP CONSTRAINT "ProfilePicture_collaboratorId_fkey";

-- DropForeignKey
ALTER TABLE "ProfilePicture" DROP CONSTRAINT "ProfilePicture_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_companyId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectTeam" DROP CONSTRAINT "ProjectTeam_leaderId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectTeam" DROP CONSTRAINT "ProjectTeam_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_collaboratorAssignedId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_projectId_fkey";

-- DropForeignKey
ALTER TABLE "TaskComment" DROP CONSTRAINT "TaskComment_madeById_fkey";

-- DropForeignKey
ALTER TABLE "TaskComment" DROP CONSTRAINT "TaskComment_taskId_fkey";

-- DropForeignKey
ALTER TABLE "TaskOccupation" DROP CONSTRAINT "TaskOccupation_occupationId_fkey";

-- DropForeignKey
ALTER TABLE "TaskOccupation" DROP CONSTRAINT "TaskOccupation_taskId_fkey";

-- DropForeignKey
ALTER TABLE "TeamCollaborator" DROP CONSTRAINT "TeamCollaborator_collaboratorId_fkey";

-- DropForeignKey
ALTER TABLE "TeamCollaborator" DROP CONSTRAINT "TeamCollaborator_teamId_fkey";

-- DropTable
DROP TABLE "Collaborator";

-- DropTable
DROP TABLE "Entity";

-- DropTable
DROP TABLE "Occupation";

-- DropTable
DROP TABLE "Permission";

-- DropTable
DROP TABLE "ProfilePicture";

-- DropTable
DROP TABLE "Project";

-- DropTable
DROP TABLE "ProjectTeam";

-- DropTable
DROP TABLE "Task";

-- DropTable
DROP TABLE "TaskComment";

-- DropTable
DROP TABLE "TaskOccupation";

-- DropTable
DROP TABLE "TeamCollaborator";

-- CreateTable
CREATE TABLE "collaborators" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" "CollaboratorRole" NOT NULL DEFAULT 'COLLABORATOR',
    "companyId" UUID NOT NULL,
    "occupationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "collaborators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "occupations" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "occupations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "goals" TEXT,
    "deadline" DATE NOT NULL,
    "companyId" UUID NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL,
    "updatedAt" TIMESTAMP(6) NOT NULL,
    "deletedAt" TIMESTAMP(6),
    "status" "ProjectStatus" NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_teams" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "leaderId" UUID NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "project_teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_collaborators" (
    "id" UUID NOT NULL,
    "teamId" UUID NOT NULL,
    "collaboratorId" UUID NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL,
    "deletedAt" TIMESTAMP(6),

    CONSTRAINT "team_collaborators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "dueDate" DATE NOT NULL,
    "startDate" DATE NOT NULL,
    "priority" "TaskPriority" NOT NULL,
    "status" "TaskStatus" NOT NULL,
    "projectId" UUID NOT NULL,
    "collaboratorAssignedId" UUID NOT NULL,
    "createdById" UUID NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL,
    "updatedAt" TIMESTAMP(6) NOT NULL,
    "deletedAt" TIMESTAMP(6),

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_occupations" (
    "id" UUID NOT NULL,
    "taskId" UUID NOT NULL,
    "occupationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL,
    "deletedAt" TIMESTAMP(6),

    CONSTRAINT "task_occupations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_comments" (
    "id" UUID NOT NULL,
    "comment" TEXT NOT NULL,
    "taskId" UUID NOT NULL,
    "madeById" UUID NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "task_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_pictures" (
    "id" UUID NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "collaboratorId" UUID,
    "companyId" UUID,

    CONSTRAINT "profile_pictures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entites" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "entites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" UUID NOT NULL,
    "role" "PermissionRole" NOT NULL,
    "entityId" INTEGER NOT NULL,
    "canGet" BOOLEAN NOT NULL,
    "canGetOne" BOOLEAN NOT NULL,
    "canCreate" BOOLEAN NOT NULL,
    "canUpdate" BOOLEAN NOT NULL,
    "canDelete" BOOLEAN NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "collaborators_email_key" ON "collaborators"("email");

-- AddForeignKey
ALTER TABLE "collaborators" ADD CONSTRAINT "collaborators_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collaborators" ADD CONSTRAINT "collaborators_occupationId_fkey" FOREIGN KEY ("occupationId") REFERENCES "occupations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_teams" ADD CONSTRAINT "project_teams_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_teams" ADD CONSTRAINT "project_teams_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "collaborators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_collaborators" ADD CONSTRAINT "team_collaborators_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "project_teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_collaborators" ADD CONSTRAINT "team_collaborators_collaboratorId_fkey" FOREIGN KEY ("collaboratorId") REFERENCES "collaborators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_collaboratorAssignedId_fkey" FOREIGN KEY ("collaboratorAssignedId") REFERENCES "collaborators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "collaborators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_occupations" ADD CONSTRAINT "task_occupations_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_occupations" ADD CONSTRAINT "task_occupations_occupationId_fkey" FOREIGN KEY ("occupationId") REFERENCES "occupations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_comments" ADD CONSTRAINT "task_comments_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_comments" ADD CONSTRAINT "task_comments_madeById_fkey" FOREIGN KEY ("madeById") REFERENCES "collaborators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_pictures" ADD CONSTRAINT "profile_pictures_collaboratorId_fkey" FOREIGN KEY ("collaboratorId") REFERENCES "collaborators"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_pictures" ADD CONSTRAINT "profile_pictures_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "entites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
