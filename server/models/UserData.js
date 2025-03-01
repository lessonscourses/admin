import mongoose from "mongoose";

const UserDataScema = new mongoose.Schema({
  id_user: {
    type: String,
    require: true,
    trim: true,
    lowercase: true,
  },
  username: {
    type: String,
    require: true,
    trim: true,
    lowercase: true,
  },
  img: { type: Array, default: [] },
  date_registration: { type: Date, default: Date.now },
  activation_date: { type: Date, default: null },
  activation_get: {
    type: String,
    trim: true,
    lowercase: true,
  },
  status: { type: Boolean, default: false },
  blocking: { type: Boolean, default: false },
  verification: { type: Boolean, default: false },
});

const UserData = mongoose.model("Userdata", UserDataScema);

export default UserData;
