import express from "express";
import { myBookings, createPendingBooking } from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get bookings for logged-in user
router.get("/my", protect, myBookings);

// Create a booking (pending)
router.post("/", protect, createPendingBooking);

export default router;
