import express from "express";
import nodemailer from "nodemailer";
import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
dotenv.config();
mongoose
  .connect(process.env.MONGO, { serverSelectionTimeoutMS: 20000 })
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });
const app = express();
app.use(express.json());
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

app.use((error, req, res, next) => {
  const statuscode = error.statuscode || 500;
  const message = error.message || "Internal Server Error";

  return res.status(statuscode).json({
    success: false,
    statuscode,
    message,
  });
});
