/*
  Warnings:

  - You are about to drop the `Counter` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Counter";

-- CreateTable
CREATE TABLE "counters" (
    "id" TEXT NOT NULL,
    "type" "CounterType" NOT NULL,
    "department" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "lastSerial" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "counters_pkey" PRIMARY KEY ("id")
);
