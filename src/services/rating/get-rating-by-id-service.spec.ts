import { describe, test, expect, beforeEach } from "vitest";
import { InMemoryRatingRepository } from "../../repositories/in-memory/in-memory-rating-repository";
import { CreateRatingService } from "./create-rating-service";
import { InMemoryMovieRepository } from "../../repositories/in-memory/in-memory-movie-repository";
import { CreateMovieService } from "../movie/create-movie-service";
import { GetRatingByIdService } from "./get-rating-by-id-service";

let ratingRepository: InMemoryRatingRepository;
let movieRepository: InMemoryMovieRepository;
let createRatingService: CreateRatingService;
let createMovieService: CreateMovieService;
let getRatingByIdService: GetRatingByIdService;

describe("Teste unitário para retornar uma avaliação do banco de dados", () => {
  beforeEach(() => {
    // mock do banco de dados
    ratingRepository = new InMemoryRatingRepository();

    movieRepository = new InMemoryMovieRepository();

    createRatingService = new CreateRatingService(
      ratingRepository,
      movieRepository
    );

    createMovieService = new CreateMovieService(movieRepository);

    getRatingByIdService = new GetRatingByIdService(ratingRepository);
  });

  test("Deve retornar uma avaliação", async () => {
    await createMovieService.execute({
      title: "The Avengers",
    });

    await createRatingService.execute({
      name: "Matheus",
      note: 9.5,
      comment: "Filme muito bom",
      id_movie: 1,
    });

    const rating = await getRatingByIdService.execute({
      id: 1,
    });

    expect(rating).toBeTruthy();
  });

  test("Não deve retornar se o ID passado não corresponder a uma avaliação", async () => {
    await expect(async () => {
      await getRatingByIdService.execute({
        id: 1927831823,
      });
    }).rejects.toThrowError("Nenhuma avaliação encontrada");
  });
});
