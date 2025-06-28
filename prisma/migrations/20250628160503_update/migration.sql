/*
  Warnings:

  - You are about to drop the column `department` on the `counters` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[type]` on the table `counters` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "counters" DROP COLUMN "department";

-- CreateIndex
CREATE UNIQUE INDEX "counters_type_key" ON "counters"("type");
