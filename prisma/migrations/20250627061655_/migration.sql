/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `userProfiles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "userProfiles" DROP COLUMN "phoneNumber";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "phone" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");
