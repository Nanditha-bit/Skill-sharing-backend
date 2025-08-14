import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  workshop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workshop',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dateBooked: {
    type: Date,
    default: Date.now
  }
});

// ✅ Prevent OverwriteModelError
const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export default Booking;
