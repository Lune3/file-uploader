-- AlterTable
ALTER TABLE "File" ADD COLUMN     "fileUrl" TEXT,
ALTER COLUMN "size" DROP NOT NULL;
