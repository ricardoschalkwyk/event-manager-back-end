const express = require("express");
const { auth } = require("../../middlewares");
const eventService = require("./event.service");

const router = express.Router();

router.get("/", auth, async (req, res, next) => {
  // The auth function is called here for verifying the token on get requests
  try {
    // Inside this try I'm trying to find a certain users events
    const { sub } = req.user;

    // By using the user-id I can findAll of the users events
    const data = await eventService.findAll({ user: sub });

    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get("/all", auth, async (req, res, next) => {
  // Get Every user created event
  try {
    // Find every existing event
    const data = await eventService.findAllUserEvents();

    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", auth, async (req, res, next) => {
  try {
    // Find a certain event
    const data = await eventService.findOne(req.params.id);

    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get("/findByUserId/:id", auth, async (req, res, next) => {
  // find an event that belongs to a certain user
  try {
    const data = await eventService.findByUserId(req.params.id);

    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get("/:id/join", auth, async (req, res) => {
  const { sub } = req.user;

  const data = await eventService.join(req.params.id, sub);

  res.json(data);
});

router.get("/:id/leave/:userId", auth, async (req, res) => {
  // This is used to leave a list
  const data = await eventService.leave(req.params.id, req.params.userId);

  res.json(data);
});

router.put("/:id", async (req, res) => {
  // This will update an event
  const data = await eventService.update(req.params.id, req.body);

  res.json(data);
});

router.post("/", auth, async (req, res) => {
  // Again sub is used for the user-id
  const { sub } = req.user;

  // Data is created from an input field on the front-end
  // Then user-id is added to that created data
  const data = await eventService.create({
    ...req.body,
    user: sub,
  });

  if (data.length === 0) {
    res.status(404).json({
      message: "Could not create event",
    });
  }

  res.json(data);
});

router.delete("/:id", async (req, res) => {
  // Removes data determined by the event id
  const data = await eventService.remove(req.params.id);

  if (!data) {
    res.status(404).json({
      message: "Could not find event",
    });
  }

  res.json(data);
});

module.exports = router;
