import { describe, test, expect, beforeEach } from "vitest";
import { InMemoryRatingRepository } from "../../repositories/in-memory/in-memory-rating-repository";
import { CreateRatingService } from "./create-rating-service";
import { InMemoryMovieRepository } from "../../repositories/in-memory/in-memory-movie-repository";
import { CreateMovieService } from "../movie/create-movie-service";

let ratingRepository: InMemoryRatingRepository;
let movieRepository: InMemoryMovieRepository;
let createRatingService: CreateRatingService;
let createMovieService: CreateMovieService;

describe("Teste unitário para criação de uma avaliação no banco de dados", () => {
  beforeEach(() => {
    // mock do banco de dados
    ratingRepository = new InMemoryRatingRepository();

    movieRepository = new InMemoryMovieRepository();

    createRatingService = new CreateRatingService(
      ratingRepository,
      movieRepository
    );

    createMovieService = new CreateMovieService(movieRepository);
  });

  test("Deve ser possível fazer a criação de uma avaliação", async () => {
    await createMovieService.execute({
      title: "The Avengers",
    });

    const rating = await createRatingService.execute({
      name: "Matheus",
      note: 9.5,
      comment: "Filme muito bom",
      id_movie: 1,
    });

    expect(rating).toBeTruthy();
  });

  test("Não deve fazer a criação se o ID passado não corresponder a um filme", async () => {
    await expect(async () => {
      await createRatingService.execute({
        name: "Matheus",
        note: 9.5,
        comment: "Filme muito bom",
        id_movie: 228193789,
      });
    }).rejects.toThrowError("Nenhum filme encontrado");
  });
});
