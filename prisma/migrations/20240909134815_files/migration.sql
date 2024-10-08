-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" DOUBLE PRECISION NOT NULL,
    "uploadTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FolderId" TEXT NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_FolderId_fkey" FOREIGN KEY ("FolderId") REFERENCES "Folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
