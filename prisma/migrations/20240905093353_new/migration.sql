/*
  Warnings:

  - Made the column `rootFolder` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_rootFolder_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "rootFolder" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_rootFolder_fkey" FOREIGN KEY ("rootFolder") REFERENCES "Folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
