import mongoose from "mongoose";

const courseScema = new mongoose.Schema({
  category: { type: String, require: true, trim: true },
  categorychild: { type: String, require: true, trim: true },
  title: { type: String, require: true, trim: true },
  kirilica: { type: String, require: true, trim: true },
  preview: { type: String, require: true, trim: true },
  img: { type: Array, default: [] },
  galery: { type: Array, default: [] },
  duration: { type: String, require: true, trim: true },
  number_of_lessons: { type: String, require: true, trim: true },
  release_date: { type: String, require: true, trim: true },
  language: { type: String, require: true, trim: true },
  raiting: { type: Number, require: true, trim: true },
  show_catalog: { type: Boolean, default: true },
  show_new: { type: Boolean, default: false },
  show_top: { type: Boolean, default: false },
  description: { type: String, require: true, trim: true },
  filter: { type: Array, default: [] },
});

const CoursesModel = mongoose.model("course", courseScema);

export default CoursesModel;
