const express = require('express');
const team = new express.Router();
const { auth_admin, auth_user } = require("../middleware/auth");
const db = require("../db/prisma");
const { v4: uuidv4 } = require('uuid');

team.post('/team', auth_user, async (req, res) => {
  try {

    function generateSixDigitNumber() {
      return Math.floor(100000 + Math.random() * 900000);
    }

    async function generateUniqueSixDigitNumber(db) {
      let unique = false;
      let uniqueNumber;
      while (!unique) {
        uniqueNumber = generateSixDigitNumber();
        const exists = await db.team.findUnique({
          where: {
            team_id: uniqueNumber.toString(),
          },
        });
        if (!exists) {
          unique = true;
        }
      }
      return uniqueNumber;
    }

    const { userId } = req.user;
    const { eventId, team_name } = req.body;

    const tempEventId = parseInt(eventId);

    if (!tempEventId) {
      res.status(400).send("Insufficient Data");
      return;
    }

    const eventDetails = await db.event.findUnique({
      where: {
        id: tempEventId
      }
    });

    if (!eventDetails) {
      res.status(404).send("Event not found");
      return;
    }

    const teamId = await generateUniqueSixDigitNumber(db);

    if (eventDetails.team_size == 1) {
      // For solo event
      const solo = await db.team.findFirst({
        where: {
          team_lead_id: userId,
          event_id: tempEventId
        }
      });
      if (!solo) {
        await db.team.create({
          data: {
            team_id: teamId.toString(),
            event_id: tempEventId,
            team_lead_id: userId
          }
        });
        res.status(200).send("User successfully registered");
        return;
      } else {
        res.status(409).send("User Already Registered");
        return;
      }
    } else if (eventDetails.team_size > 1) {
      // For team event
      if (!team_name) {
        res.status(400).send("Insufficient Data");
        return;
      }

      // Check if the user is already a team lead or a member of any team for this event
      const existingTeam = await db.team.findFirst({
        where: {
          event_id: tempEventId,
          OR: [
            { team_lead_id: userId },
            { team_members: { some: { id: userId } } }
          ]
        }
      });

      if (existingTeam) {
        res.status(409).send("User is already registered as a lead or a member for this event");
        return;
      }

      const createdTeam = await db.team.create({
        data: {
          team_id: teamId.toString(),
          event_id: tempEventId,
          team_lead_id: userId,
          team_name: team_name
        }
      });
      res.status(200).send({
        "team_id": createdTeam.team_id
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});


team.post('/team/join', auth_user, async (req, res) => {
  try {
    const { teamId } = req.body;
    if (!teamId) {
      res.status(409).send("Insufficient Data");
      return;
    }
    const { userId } = req.user;
    console.log(teamId, userId);
    //check if team exists
    const isTeam = await db.team.findUnique({
      where: {
        team_id: teamId,
      },
      include: {
        team_members: true,
        event: true
      }
    });
    if (!isTeam) {
      res.status(409).send('The team or event doesnt exist');
      return;
    } console.log(isTeam.team_members.length);

    if ((isTeam.team_members.length >= isTeam.event.team_size - 1)) {
      res.status(409).send('The team is full');
      return;
    }

    //check if already a member of team leader
    const existingTeam = await db.team.findFirst({
      where: {
        event_id: isTeam.event.id,
        OR: [
          { team_lead_id: userId },
          { team_members: { some: { id: userId } } } // Assuming 'team_members' is the relation field
        ]
      }
    });
    if (existingTeam) {
      res.status(409).send('User is already registered or member of the team');
      return;
    }
    await db.team.update({
      where: {
        team_id: teamId
      },
      data: {
        team_members: {
          connect: [{ id: userId }]
        }
      }
    });
    res.status(200).send("Added as a teamate");
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal Server Error");
  }
});

team.get('/team', auth_user, async (req, res) => {
  try {
    console.log(req.query);
    const { teamId } = req.query;
    if (!teamId) {
      res.status(409).send("Insufficient Data");
      return;
    }
    const data = await db.team.findUnique({
      where: {
        team_id: teamId
      },
      select: {
        team_id: true,
        team_name: true,
        team_lead_id: false,
        team_lead: {
          select: {
            name: true,
            id: true,
          }
        },
        event: {
          select: {
            id: true,
            name: true,
            team_size: true
          }
        },
        team_members: {
          select: {
            id: true
          }
        }
      }
    });
    res.status(200).send(data);
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal Server Error");
  }
});

team.get('/team/user', auth_user, async (req, res) => {
  try {
    const { userId } = req.user;
    const team = await db.team.findMany({
      where: {
        OR: [
          { team_lead_id: userId },
          { team_members: { some: { id: userId } } }
        ]
      },
      select: {
        team_id: true,
        team_name: true,
        team_lead_id: false,
        team_lead: {
          select: {
            name: true,
            id: true,
          }
        },
        event: {
          select: {
            id: true,
            name: true,
            team_size: true,
            date_time: true
          }
        },
        team_members: {
          select: {
            name: true,
            id: true
          }
        }
      }
    });
    teamMembers = team.map(member => ({ ...member, userId }));
    res.status(200).send(teamMembers);
  } catch (e) {
    console.log(e);
  }
})

team.post('/team/remove_teamate', auth_user, async (req, res) => {
  try {
    const { userId } = req.user;
    const { teamId, teamMateId } = req.body;
    
    if(!teamId && !teamMateId){
      res.status(400).send("Insufficient Information");
      return;
    }
    
    const team = await db.team.findUnique({
      where: {
        team_id: teamId,
        team_lead_id: userId,
        team_members: {
          some: {
            id: teamMateId
          }
        }
      }
    });

    if (!team) {
      res.status(409).send("Team not found or you are not the team lead.");
      return;
    }

    await db.team.update({
      where: {
        team_id: teamId,
      },
      data: {
        team_members: {
          disconnect: [{ id: teamMateId }],
        },
      },
    });
    res.status(200).send("Teammate removed successfully.");
 } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while removing the teammate.");
  }
});


module.exports = team;
