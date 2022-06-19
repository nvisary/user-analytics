import "dotenv/config";
import path from "node:path";
import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";

import { Track } from "./models";

const PUBLIC_PORT = process.env.PUBLIC_PORT
  ? Number.parseInt(process.env.PUBLIC_PORT)
  : 8000;
const APP_PORT = process.env.APP_PORT
  ? Number.parseInt(process.env.APP_PORT)
  : 8001;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(cors());
mongoose.connect(
  `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/analytics`,
  {},
  () => console.log("Connected to database")
);

app.listen(PUBLIC_PORT, () => console.log(`Listen port ${PUBLIC_PORT}`));
app.listen(APP_PORT, () => console.log(`Listen port ${APP_PORT}`));

app.post("/track", async (req: Request, res: Response, next: NextFunction) => {
  if (req.socket.localPort === APP_PORT) {
    res.sendStatus(200);

    try {
      const body = JSON.parse(req.body); // use text/plain to disable CORS preflight requests
      if (body?.events) {
        await Track.insertMany(body.events);
      }
    } catch (err) {
      console.error(err);
    }

    return;
  }

  next();
});

app.get(
  "(/:id([1-2]{1}).html)|(/)",
  (req: Request, res: Response, next: NextFunction) => {
    if (req.socket.localPort === PUBLIC_PORT) {
      return res.sendFile(path.join(__dirname, "..", "/public/index.html"));
    }

    next();
  }
);

app.get("/", (req: Request, res: Response) => {
  if (req.socket.localPort === APP_PORT) {
    return res.sendFile(
      path.join(__dirname, "..", "/public/analytics/tracker.js")
    );
  }

  res.sendStatus(404);
});
