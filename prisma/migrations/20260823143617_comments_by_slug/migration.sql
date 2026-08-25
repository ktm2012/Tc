/*
  Warnings:

  - Added the required column `postSlug` to the `comments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "postSlug" TEXT NOT NULL,
ALTER COLUMN "postId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "comments_postSlug_idx" ON "comments"("postSlug");
