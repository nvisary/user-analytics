import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.listen(process.env.PORT, () => console.log(`Listen port ${process.env.PORT}`));
app.listen(process.env.STATIC_PORT, () => console.log(`Listen port ${process.env.STATIC_PORT}`))

app.get("/", (_, res) => res.send("Hello"))