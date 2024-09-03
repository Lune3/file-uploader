/*
  Warnings:

  - A unique constraint covering the columns `[rootFolder]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Folder_id_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "rootFolder" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_rootFolder_key" ON "User"("rootFolder");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_rootFolder_fkey" FOREIGN KEY ("rootFolder") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
