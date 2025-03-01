import mongoose from "mongoose";

const lessonScema = new mongoose.Schema({
  course: { type: String, require: true, trim: true },
  name: { type: String, require: true, trim: true },
  number: { type: String, require: true, trim: true },
  lesson_number: { type: String, require: true, trim: true },
  time: { type: String, require: true, trim: true },
  link_video: { type: String, require: true, trim: true },
  video: { type: Array, default: [] },
  description: { type: String, require: true, trim: true },
});

const LessonModel = mongoose.model("lesson", lessonScema);

export default LessonModel;
