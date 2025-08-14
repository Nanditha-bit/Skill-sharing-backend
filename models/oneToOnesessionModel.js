import mongoose from "mongoose";

const oneToOneSessionSchema = new mongoose.Schema(
  {
    skill: { type: String, required: true },
    date: { type: Date, required: true },
    duration: { type: Number, required: true }, // in minutes or hours
    requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

const OneToOneSession =
  mongoose.models.OneToOneSession || mongoose.model("OneToOneSession", oneToOneSessionSchema);

export default OneToOneSession;
