/*
  Warnings:

  - You are about to drop the `ParticipantEvents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ParticipantEvents` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ParticipantEvents" DROP CONSTRAINT "ParticipantEvents_eventId_fkey";

-- DropForeignKey
ALTER TABLE "ParticipantEvents" DROP CONSTRAINT "ParticipantEvents_participantId_fkey";

-- DropForeignKey
ALTER TABLE "_ParticipantEvents" DROP CONSTRAINT "_ParticipantEvents_A_fkey";

-- DropForeignKey
ALTER TABLE "_ParticipantEvents" DROP CONSTRAINT "_ParticipantEvents_B_fkey";

-- DropTable
DROP TABLE "ParticipantEvents";

-- DropTable
DROP TABLE "_ParticipantEvents";

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamParticipants" (
    "teamId" INTEGER NOT NULL,
    "participantId" TEXT NOT NULL,

    CONSTRAINT "TeamParticipants_pkey" PRIMARY KEY ("teamId","participantId")
);

-- CreateTable
CREATE TABLE "_TeamParticipants" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TeamParticipants_AB_unique" ON "_TeamParticipants"("A", "B");

-- CreateIndex
CREATE INDEX "_TeamParticipants_B_index" ON "_TeamParticipants"("B");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamParticipants" ADD CONSTRAINT "TeamParticipants_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamParticipants" ADD CONSTRAINT "TeamParticipants_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamParticipants" ADD CONSTRAINT "_TeamParticipants_A_fkey" FOREIGN KEY ("A") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamParticipants" ADD CONSTRAINT "_TeamParticipants_B_fkey" FOREIGN KEY ("B") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
