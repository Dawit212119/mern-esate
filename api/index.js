import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
//import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import path from "path";
import listingRouter from "./routes/listing.route.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
//import { verifyToken } from "./utils/VerifyUser.js";
dotenv.config();
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// const _dirname = path.resolve();

// use await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test'); if your database has auth enabled
const app = express();
app.use(express.json());
app.use(cookieParser());
//app.use(cookieParser());
//app.use(verifyToken);
const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);
app.use(express.static(path.join(__dirname, "../client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});
//app.use("/api/listing", listingRouter);
//app.use("/api/user", userRouter);
//middleware for handling the error
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error!";
  return res.status(statusCode).json({
    message,
    success: false,
    statusCode,
  });
});
