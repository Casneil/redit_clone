import "reflect-metadata";
import { createConnection } from "typeorm";
import express, { Response } from "express";
import morgan from "morgan";
import cors from "cors";

import authRoutes from "./routes/auth";
import postsRoutes from "./routes/posts";
import subRoutes from "./routes/subs";
import miscRoutes from "./routes/misc";
//Middleware
import trim from "./middleware/trim";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(trim);
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200,
  })
);
app.use(express.static("public"));

app.get("/", (_, res: Response) => res.send("Hello World"));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/subs", subRoutes);
app.use("/api/misc", miscRoutes);

app.listen(process.env.PORT, async () => {
  console.log(`Running at http:localhost:${process.env.PORT}`);

  try {
    await createConnection();
    console.log("database connected");
  } catch (error) {
    console.log(error);
  }
});
