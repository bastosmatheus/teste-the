import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { configDotenv } from "dotenv";
import { movieRouter } from "./routes/movie-route";
import { errorHandler } from "./middlewares/error-handler";
import { ratingRouter } from "./routes/rating-route";

configDotenv();
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(movieRouter);
app.use(ratingRouter);

app.use("/ping", (request: Request, response: Response) => {
  response.send("POOONG");
});

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`server rodando: http://localhost:${process.env.PORT}`);
});
