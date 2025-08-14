import express from "express";
import Workshop from "../models/workshopModel.js";
import Booking from "../models/bookingModel.js";
import OneToOneSession from "../models/oneToOneSessionModel.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @desc   Get all workshops
 * @route  GET /api/workshops
 * @access Public
 */
router.get("/", async (req, res) => {
  try {
    const workshops = await Workshop.find().populate("host", "name email");
    res.json(workshops);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

/**
 * @desc   Create a workshop
 * @route  POST /api/workshops
 * @access Private
 */
router.post("/", protect, async (req, res) => {
  const { title, description, date, priceINR } = req.body;

  if (!title || !description || !date) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }

  try {
    const workshop = new Workshop({
      title,
      description,
      date,
      priceINR: priceINR || 0, // Free if not provided
      host: req.user._id
    });

    const createdWorkshop = await workshop.save();
    res.status(201).json(createdWorkshop);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

/**
 * @desc   Book a workshop
 * @route  POST /api/workshops/:id/book
 * @access Private
 */
router.post("/:id/book", protect, async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    const booking = new Booking({
      workshop: workshop._id,
      user: req.user._id
    });

    const createdBooking = await booking.save();
    res.status(201).json({ message: "Workshop booked successfully", booking: createdBooking });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

/**
 * @desc   Create a 1-to-1 session
 * @route  POST /api/1to1
 * @access Private
 */
router.post("/1to1", protect, async (req, res) => {
  const { skill, date, duration } = req.body;

  if (!skill || !date || !duration) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }

  try {
    const session = new OneToOneSession({
      skill,
      date,
      duration,
      requester: req.user._id
    });

    const createdSession = await session.save();
    res.status(201).json({ message: "1-to-1 session created", session: createdSession });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

export default router;
