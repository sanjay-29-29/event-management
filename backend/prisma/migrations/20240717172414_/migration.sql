/*
  Warnings:

  - Added the required column `details` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizer` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "details" TEXT NOT NULL,
ADD COLUMN     "organizer" TEXT NOT NULL;
