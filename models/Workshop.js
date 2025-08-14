import mongoose from "mongoose";

const workshopSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  priceINR: {
    type: Number,
    default: 0
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

// ✅ Fix OverwriteModelError
const Workshop = mongoose.models.Workshop || mongoose.model("Workshop", workshopSchema);

export default Workshop;
