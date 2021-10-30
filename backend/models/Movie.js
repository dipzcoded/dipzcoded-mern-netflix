import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
    },
    imageTitle: {
      type: String,
    },
    imageThumbnail: {
      type: String,
    },
    trailer: {
      type: String,
    },
    video: {
      type: String,
    },
    year: {
      type: String,
    },
    ageLimit: {
      type: Number,
    },
    genre: {
      type: String,
    },
    // duration : {
    //     type : Date
    // }
    isSeries: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const movieModel = mongoose.model("Movie", movieSchema);
export default movieModel;
