import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { notFound, errorHandler } from "./middlewares/error.js";
import authRoutes from "./routes/api/auth.js";
import userRoutes from "./routes/api/users.js";
import filmRoutes from "./routes/api/movies.js";
import listRoutes from "./routes/api/lists.js";

// loading up all environment variables
dotenv.config();

// connecting to database
connectDB();

// App init
const app = express();

// middlewares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/films", filmRoutes);
app.use("/api/lists", listRoutes);

// not found route
app.use(notFound);

// error handler middleware
app.use(errorHandler);

// PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server connection on port:${PORT} is successfully connected`);
});
