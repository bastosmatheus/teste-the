import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryMovieRepository } from "../../repositories/in-memory/in-memory-movie-repository";
import { InMemoryRatingRepository } from "../../repositories/in-memory/in-memory-rating-repository";
import { CreateMovieService } from "../movie/create-movie-service";
import { CreateRatingService } from "./create-rating-service";
import { GetAllRatingsService } from "./get-all-ratings-service";

let ratingRepository: InMemoryRatingRepository;
let movieRepository: InMemoryMovieRepository;
let createRatingService: CreateRatingService;
let createMovieService: CreateMovieService;
let getAllRatingsService: GetAllRatingsService;

describe("Teste unitário para retornar todas avaliações do banco de dados", () => {
  beforeEach(() => {
    // mock do banco de dados
    ratingRepository = new InMemoryRatingRepository();

    movieRepository = new InMemoryMovieRepository();

    createRatingService = new CreateRatingService(
      ratingRepository,
      movieRepository
    );

    createMovieService = new CreateMovieService(movieRepository);

    getAllRatingsService = new GetAllRatingsService(ratingRepository);
  });

  test("Deve retornar todas as avaliações do banco de dados", async () => {
    await createMovieService.execute({
      title: "The Avengers",
    });

    await createRatingService.execute({
      name: "Matheus",
      note: 9.5,
      comment: "Filme muito bom",
      id_movie: 1,
    });

    await createRatingService.execute({
      name: "Roberto",
      note: 4.5,
      comment: "Filme muito ruim",
      id_movie: 1,
    });

    const ratings = await getAllRatingsService.execute();

    expect(ratings).toBeTruthy();
    expect(ratings).toHaveLength(2);
  });
});
