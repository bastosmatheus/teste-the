import { NextFunction, Request, Response, Router } from "express";
import { MovieController } from "../controllers/movie-controller";
import { MovieRepositoryDatabase } from "../repositories/movie-repository-database";
import { MysqlConnection } from "../database/mysql-connection";

const movieRouter = Router();
const databaseConnection = new MysqlConnection();
const movieRepository = new MovieRepositoryDatabase(databaseConnection);
const movieController = new MovieController(movieRepository);

movieRouter.get("/movies", async (request: Request, response: Response) => {
  await movieController.getAllMovies(request, response);
});

movieRouter.get(
  "/movies/title",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      await movieController.getMoviesByTitle(request, response);
    } catch (error: unknown) {
      next(error);
    }
  }
);

movieRouter.get(
  "/movies/:id",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      await movieController.getMovieById(request, response);
    } catch (error: unknown) {
      next(error);
    }
  }
);

movieRouter.post(
  "/movies",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      await movieController.createMovie(request, response);
    } catch (error: unknown) {
      next(error);
    }
  }
);

movieRouter.patch(
  "/movies/:id",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      await movieController.updateMovie(request, response);
    } catch (error: unknown) {
      next(error);
    }
  }
);

movieRouter.delete(
  "/movies/:id",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      await movieController.deleteMovie(request, response);
    } catch (error: unknown) {
      next(error);
    }
  }
);

export { movieRouter };
