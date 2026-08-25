-- CreateTable
CREATE TABLE "asset_attachments" (
    "id" TEXT NOT NULL,
    "kind" "AttachmentKind" NOT NULL,
    "key" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "assetId" TEXT NOT NULL,

    CONSTRAINT "asset_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "asset_attachments_assetId_idx" ON "asset_attachments"("assetId");

-- AddForeignKey
ALTER TABLE "asset_attachments" ADD CONSTRAINT "asset_attachments_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
