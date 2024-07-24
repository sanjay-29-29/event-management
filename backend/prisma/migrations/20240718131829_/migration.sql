/*
  Warnings:

  - The primary key for the `Team` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `eventId` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `teamSize` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the `TeamParticipants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TeamParticipants` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[team_lead_id]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `event_id` to the `Team` table without a default value. This is not possible if the table is not empty.
  - The required column `team_id` was added to the `Team` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `team_lead_id` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_eventId_fkey";

-- DropForeignKey
ALTER TABLE "TeamParticipants" DROP CONSTRAINT "TeamParticipants_participantId_fkey";

-- DropForeignKey
ALTER TABLE "TeamParticipants" DROP CONSTRAINT "TeamParticipants_teamId_fkey";

-- DropForeignKey
ALTER TABLE "_TeamParticipants" DROP CONSTRAINT "_TeamParticipants_A_fkey";

-- DropForeignKey
ALTER TABLE "_TeamParticipants" DROP CONSTRAINT "_TeamParticipants_B_fkey";

-- AlterTable
ALTER TABLE "Team" DROP CONSTRAINT "Team_pkey",
DROP COLUMN "eventId",
DROP COLUMN "id",
DROP COLUMN "name",
DROP COLUMN "teamSize",
ADD COLUMN     "event_id" INTEGER NOT NULL,
ADD COLUMN     "team_id" TEXT NOT NULL,
ADD COLUMN     "team_lead_id" TEXT NOT NULL,
ADD COLUMN     "team_name" TEXT,
ADD CONSTRAINT "Team_pkey" PRIMARY KEY ("team_id");

-- DropTable
DROP TABLE "TeamParticipants";

-- DropTable
DROP TABLE "_TeamParticipants";

-- CreateTable
CREATE TABLE "_TeamMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TeamMembers_AB_unique" ON "_TeamMembers"("A", "B");

-- CreateIndex
CREATE INDEX "_TeamMembers_B_index" ON "_TeamMembers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Team_team_lead_id_key" ON "Team"("team_lead_id");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_team_lead_id_fkey" FOREIGN KEY ("team_lead_id") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamMembers" ADD CONSTRAINT "_TeamMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamMembers" ADD CONSTRAINT "_TeamMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "Team"("team_id") ON DELETE CASCADE ON UPDATE CASCADE;
