/*
  Warnings:

  - You are about to drop the column `deleteAt` on the `collaborators` table. All the data in the column will be lost.
  - You are about to drop the column `deleteAt` on the `companies` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `companies` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "collaborators" DROP COLUMN "deleteAt",
ADD COLUMN     "deletedAt" TIMESTAMP(6);

-- AlterTable
ALTER TABLE "companies" DROP COLUMN "deleteAt",
ADD COLUMN     "deletedAt" TIMESTAMP(6);

-- CreateIndex
CREATE UNIQUE INDEX "companies_name_key" ON "companies"("name");
