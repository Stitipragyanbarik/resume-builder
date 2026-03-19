import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  resumeId: String,
  name: String,
  skills: [String],

  downloads: {
    type: Number,
    default: 0
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  expiresAt: {
    type: Date
  },

  logs: [
    {
      action: String,
      time: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

export default mongoose.model("Resume", resumeSchema);