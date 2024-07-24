/*
  Warnings:

  - A unique constraint covering the columns `[event_id,team_lead_id]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Team_team_lead_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Team_event_id_team_lead_id_key" ON "Team"("event_id", "team_lead_id");
