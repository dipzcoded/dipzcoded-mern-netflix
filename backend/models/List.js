import mongoose from "mongoose";

const listSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
  },
  genre: {
    type: String,
  },
  contents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
    },
  ],
});

const listModel = mongoose.model("List", listSchema);
export default listModel;
