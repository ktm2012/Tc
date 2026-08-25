-- CreateEnum
CREATE TYPE "AttachmentKind" AS ENUM ('IMAGE', 'FILE', 'AUDIO');

-- CreateTable
CREATE TABLE "post_attachments" (
    "id" TEXT NOT NULL,
    "kind" "AttachmentKind" NOT NULL,
    "key" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "post_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "post_attachments_postId_idx" ON "post_attachments"("postId");

-- AddForeignKey
ALTER TABLE "post_attachments" ADD CONSTRAINT "post_attachments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
