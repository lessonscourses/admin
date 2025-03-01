import mongoose from "mongoose";

const tariffsScema = new mongoose.Schema({
  name: { type: String, require: true, trim: true },
  mount: { type: String, require: true, trim: true },
  price: { type: String, require: true, trim: true },
  currency: { type: String, require: true, trim: true },
  link: { type: String, require: true, trim: true },
  icon: { type: Array, default: [] },
});

const TariffsModel = mongoose.model("tariffs", tariffsScema);

export default TariffsModel;
