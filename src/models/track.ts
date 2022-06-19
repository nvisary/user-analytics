import mongoose from "mongoose";

const trackSchema = new mongoose.Schema({
  event: {
    type: String,
    required: true,
  },
  tags: {
    type: Array,
  },
  url: {
    type: String,
    required: true,
  },
  title: {
    type: String,
  },
  ts: {
    type: String,
    required: true,
  },
});

export const Track = mongoose.model("Track", trackSchema);
