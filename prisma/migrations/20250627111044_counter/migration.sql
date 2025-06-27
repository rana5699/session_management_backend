-- CreateEnum
CREATE TYPE "CounterType" AS ENUM ('PATIENT', 'PROFESSIONAL');

-- CreateTable
CREATE TABLE "Counter" (
    "id" TEXT NOT NULL,
    "type" "CounterType" NOT NULL,
    "department" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "lastSerial" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Counter_pkey" PRIMARY KEY ("id")
);
