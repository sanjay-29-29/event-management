/*
  Warnings:

  - You are about to drop the `EventParticipant` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `password` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EventParticipant" DROP CONSTRAINT "EventParticipant_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventParticipant" DROP CONSTRAINT "EventParticipant_participantId_fkey";

-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "password" TEXT NOT NULL;

-- DropTable
DROP TABLE "EventParticipant";

-- CreateTable
CREATE TABLE "ParticipantEvents" (
    "eventId" INTEGER NOT NULL,
    "participantId" INTEGER NOT NULL,

    CONSTRAINT "ParticipantEvents_pkey" PRIMARY KEY ("eventId","participantId")
);

-- CreateTable
CREATE TABLE "_ParticipantEvents" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ParticipantEvents_AB_unique" ON "_ParticipantEvents"("A", "B");

-- CreateIndex
CREATE INDEX "_ParticipantEvents_B_index" ON "_ParticipantEvents"("B");

-- AddForeignKey
ALTER TABLE "ParticipantEvents" ADD CONSTRAINT "ParticipantEvents_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantEvents" ADD CONSTRAINT "ParticipantEvents_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParticipantEvents" ADD CONSTRAINT "_ParticipantEvents_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParticipantEvents" ADD CONSTRAINT "_ParticipantEvents_B_fkey" FOREIGN KEY ("B") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
