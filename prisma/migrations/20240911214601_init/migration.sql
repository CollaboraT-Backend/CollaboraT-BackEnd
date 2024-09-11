-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_companyId_fkey";

-- AlterTable
ALTER TABLE "projects" ALTER COLUMN "companyId" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "status" SET DEFAULT 'active';

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
