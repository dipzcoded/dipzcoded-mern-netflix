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

listSchema.pre(/^find/, function (next) {
  this.populate({ path: "contents" });
  next();
});

const listModel = mongoose.model("List", listSchema);
export default listModel;
