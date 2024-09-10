/*
  Warnings:

  - The values [COLLABORATOR,LEADER] on the enum `CollaboratorRole` will be removed. If these variants are still used in the database, this will fail.
  - The values [COMPANY,LEADER,COLLABORATOR] on the enum `PermissionRole` will be removed. If these variants are still used in the database, this will fail.
  - The values [ACTIVE,COMPLETED,ARCHIVED] on the enum `ProjectStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [LOW,MEDIUM,HIGH] on the enum `TaskPriority` will be removed. If these variants are still used in the database, this will fail.
  - The values [PENDING,IN_PROGRESS,COMPLETED] on the enum `TaskStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CollaboratorRole_new" AS ENUM ('collaborator', 'leader');
ALTER TABLE "collaborators" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "collaborators" ALTER COLUMN "role" TYPE "CollaboratorRole_new" USING ("role"::text::"CollaboratorRole_new");
ALTER TYPE "CollaboratorRole" RENAME TO "CollaboratorRole_old";
ALTER TYPE "CollaboratorRole_new" RENAME TO "CollaboratorRole";
DROP TYPE "CollaboratorRole_old";
ALTER TABLE "collaborators" ALTER COLUMN "role" SET DEFAULT 'collaborator';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PermissionRole_new" AS ENUM ('company', 'leader', 'collaborator');
ALTER TABLE "permissions" ALTER COLUMN "role" TYPE "PermissionRole_new" USING ("role"::text::"PermissionRole_new");
ALTER TYPE "PermissionRole" RENAME TO "PermissionRole_old";
ALTER TYPE "PermissionRole_new" RENAME TO "PermissionRole";
DROP TYPE "PermissionRole_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ProjectStatus_new" AS ENUM ('active', 'completed', 'archived');
ALTER TABLE "projects" ALTER COLUMN "status" TYPE "ProjectStatus_new" USING ("status"::text::"ProjectStatus_new");
ALTER TYPE "ProjectStatus" RENAME TO "ProjectStatus_old";
ALTER TYPE "ProjectStatus_new" RENAME TO "ProjectStatus";
DROP TYPE "ProjectStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TaskPriority_new" AS ENUM ('low', 'medium', 'high');
ALTER TABLE "tasks" ALTER COLUMN "priority" TYPE "TaskPriority_new" USING ("priority"::text::"TaskPriority_new");
ALTER TYPE "TaskPriority" RENAME TO "TaskPriority_old";
ALTER TYPE "TaskPriority_new" RENAME TO "TaskPriority";
DROP TYPE "TaskPriority_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TaskStatus_new" AS ENUM ('pending', 'in_progress', 'completed');
ALTER TABLE "tasks" ALTER COLUMN "status" TYPE "TaskStatus_new" USING ("status"::text::"TaskStatus_new");
ALTER TYPE "TaskStatus" RENAME TO "TaskStatus_old";
ALTER TYPE "TaskStatus_new" RENAME TO "TaskStatus";
DROP TYPE "TaskStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "collaborators" ADD COLUMN     "deleteAt" TIMESTAMP(6),
ALTER COLUMN "role" SET DEFAULT 'collaborator',
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "deleteAt" TIMESTAMP(6);

-- AlterTable
ALTER TABLE "project_teams" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "projects" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "task_comments" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "task_occupations" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "team_collaborators" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;
