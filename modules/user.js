// creating our first schema
// schema is a blueprint that we need to tell mongodb that how we are going to store our data

const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  pic: {
    type: String,
    default:
      "http://res.cloudinary.com/monu1/image/upload/v1617698188/ycsc1iqwdnw2fsadcdey.png",
  },
  followers: [{ type: ObjectId, ref: "User" }],
  following: [{ type: ObjectId, ref: "User" }],
  bio: {
    type: String,
  },
  website: {
    type: String,
  },
});

mongoose.model("User", UserSchema);
