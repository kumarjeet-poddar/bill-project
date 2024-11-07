import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from "./routes/index.js";
import cors from "cors";
dotenv.config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(router);

const URI = process.env.MONGODB_URI || "";
const port = 3002;

mongoose
  .connect(URI)
  .then(() => {
    app.listen(port, () => {
      console.log("Database connected");
    });
  })
  .catch((err) => {
  });
