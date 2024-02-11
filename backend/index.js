import express from "express";

const app = express();
const port = 8080;

import dotenv from "dotenv";
dotenv.config();

import "express-async-errors";
import cookieParser from "cookie-parser";

import connectDB from "./db/connect.js";

//middleware
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";

//rotues
import authRoutes from "./Routes/authRoutes.js";

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to my server!");
});

app.use("/api/v1/auth", authRoutes);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    console.log("Connected with DB");
    app.listen(port, () => {
      console.log(`Listening to port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
