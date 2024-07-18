/*
  Warnings:

  - The primary key for the `Participant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ParticipantEvents` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "ParticipantEvents" DROP CONSTRAINT "ParticipantEvents_participantId_fkey";

-- DropForeignKey
ALTER TABLE "_ParticipantEvents" DROP CONSTRAINT "_ParticipantEvents_B_fkey";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "team_size" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_pkey",
ADD COLUMN     "date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Participant_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Participant_id_seq";

-- AlterTable
ALTER TABLE "ParticipantEvents" DROP CONSTRAINT "ParticipantEvents_pkey",
ALTER COLUMN "participantId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ParticipantEvents_pkey" PRIMARY KEY ("eventId", "participantId");

-- AlterTable
ALTER TABLE "_ParticipantEvents" ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "ParticipantEvents" ADD CONSTRAINT "ParticipantEvents_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParticipantEvents" ADD CONSTRAINT "_ParticipantEvents_B_fkey" FOREIGN KEY ("B") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
