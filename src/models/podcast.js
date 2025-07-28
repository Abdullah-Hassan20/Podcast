import mongoose from 'mongoose';

const PodcastSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  audioUrl: { type: String, required: true },
  transcription: { type: String, required: true },
  voice: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Podcast = mongoose.models.Podcast || mongoose.model("Podcast", PodcastSchema);
export default Podcast

