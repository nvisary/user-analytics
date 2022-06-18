// import "dotenv/config";
import path from 'node:path';
import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";

const PUBLIC_PORT = 8000; // process.env.PUBLIC_PORT
const APP_PORT = 8001; //process.env.APP_PORT ??

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.listen(PUBLIC_PORT, () => console.log(`Listen port ${PUBLIC_PORT}`));
app.listen(APP_PORT, () => console.log(`Listen port ${APP_PORT}`))

app.get("(/:id([1-2]{1}).html)|(/)", (req: Request, res: Response, next: NextFunction) => {
    if (req.socket.localPort === PUBLIC_PORT) {
        return res.sendFile(path.join(__dirname, "..", '/public/index.html'));
    }

    next()
})

app.get("/", (req: Request, res: Response) => {
    if (req.socket.localPort === APP_PORT) {
        return res.sendFile(path.join(__dirname, "..", '/public/analytics/tracker.js'));
    }

    res.sendStatus(404);
})