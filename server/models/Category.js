import mongoose from "mongoose";

const categoryScema = new mongoose.Schema({
  id_category: { type: Number, require: true, trim: true },
  name: { type: String, require: true, trim: true },
  kirilica: { type: String, require: true, trim: true },
  img: { type: String, require: true, trim: true },
  show_catalog: { type: Boolean, default: true },
  icon: { type: String, require: true, trim: true },
  description: { type: String, require: true, trim: true },
});

const CategoryModel = mongoose.model("category", categoryScema);

export default CategoryModel;
