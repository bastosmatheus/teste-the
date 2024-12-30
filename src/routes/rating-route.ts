import { NextFunction, Request, Response, Router } from "express";
import { MovieRepositoryDatabase } from "../repositories/movie-repository-database";
import { MysqlConnection } from "../database/mysql-connection";
import { RatingRepositoryDatabase } from "../repositories/rating-repository-database";
import { RatingController } from "../controllers/rating-controller";

const ratingRouter = Router();
const databaseConnection = new MysqlConnection();
const ratingRepository = new RatingRepositoryDatabase(databaseConnection);
const movieRepository = new MovieRepositoryDatabase(databaseConnection);
const ratingController = new RatingController(
  ratingRepository,
  movieRepository
);

ratingRouter.get("/ratings", async (request: Request, response: Response) => {
  await ratingController.getAllRatings(request, response);
});

ratingRouter.get(
  "/ratings/:id",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      await ratingController.getRatingById(request, response);
    } catch (error: unknown) {
      next(error);
    }
  }
);

ratingRouter.post(
  "/ratings",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      await ratingController.createRating(request, response);
    } catch (error: unknown) {
      next(error);
    }
  }
);

ratingRouter.patch(
  "/ratings/:id",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      await ratingController.updateRating(request, response);
    } catch (error: unknown) {
      next(error);
    }
  }
);

ratingRouter.delete(
  "/ratings/:id",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      await ratingController.deleteRating(request, response);
    } catch (error: unknown) {
      next(error);
    }
  }
);

export { ratingRouter };
