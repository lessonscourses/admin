import mongoose from "mongoose";

const UserScema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
    trim: true,
    lowercase: true,
    unique: true,
  },
  username: {
    type: String,
    require: true,
    trim: true,
    lowercase: true,
  },
  password: { type: String, require: true, trim: true },
});

const User = mongoose.model("User", UserScema);

export default User;
