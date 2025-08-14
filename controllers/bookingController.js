import asyncHandler from 'express-async-handler';
import Booking from '../models/Booking.js';
import Workshop from '../models/Workshop.js';

export const myBookings = asyncHandler(async (req, res) => {
  const items = await Booking.find({ user: req.user._id }).populate('workshop');
  res.json(items);
});

export const createPendingBooking = asyncHandler(async (req, res) => {
  const { workshopId } = req.body;
  const ws = await Workshop.findById(workshopId);
  if (!ws) { res.status(404); throw new Error('Workshop not found'); }
  const booking = await Booking.create({
    user: req.user._id,
    workshop: ws._id,
    amountINR: ws.priceINR,
    status: 'pending'
  });
  res.status(201).json(booking);
});
