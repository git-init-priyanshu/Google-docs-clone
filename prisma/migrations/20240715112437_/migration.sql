/*
  Warnings:

  - Changed the type of `data` on the `Document` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "data",
ADD COLUMN     "data" JSONB NOT NULL;
