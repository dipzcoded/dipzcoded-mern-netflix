import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
    });
    console.log("database connection successful");
  } catch (error) {
    process.exit(1);
  }
};

export default connectDB;
