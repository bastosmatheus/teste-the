import { describe, test, expect, beforeEach } from "vitest";
import { InMemoryRatingRepository } from "../../repositories/in-memory/in-memory-rating-repository";
import { CreateRatingService } from "./create-rating-service";
import { InMemoryMovieRepository } from "../../repositories/in-memory/in-memory-movie-repository";
import { CreateMovieService } from "../movie/create-movie-service";
import { UpdateRatingService } from "./update-rating-service";

let ratingRepository: InMemoryRatingRepository;
let movieRepository: InMemoryMovieRepository;
let createRatingService: CreateRatingService;
let createMovieService: CreateMovieService;
let updateRatingService: UpdateRatingService;

describe("Teste unitário para atualização de uma avaliação no banco de dados", () => {
  beforeEach(() => {
    // mock do banco de dados
    ratingRepository = new InMemoryRatingRepository();

    movieRepository = new InMemoryMovieRepository();

    createRatingService = new CreateRatingService(
      ratingRepository,
      movieRepository
    );

    createMovieService = new CreateMovieService(movieRepository);

    updateRatingService = new UpdateRatingService(ratingRepository);
  });

  test("Deve ser possível fazer a atualização de uma avaliação", async () => {
    await createMovieService.execute({
      title: "The Avengers",
    });

    await createRatingService.execute({
      name: "Matheus",
      note: 9.5,
      comment: "Filme muito bom",
      id_movie: 1,
    });

    const rating = await updateRatingService.execute({
      id: 1,
      updatedFields: {
        note: 4,
        comment: "Filme muito ruim",
      },
    });

    expect(rating).toBeTruthy();
  });

  test("Não deve fazer a atualização se o ID passado não corresponder a uma avaliação", async () => {
    await expect(async () => {
      await updateRatingService.execute({
        id: 9182738173281,
        updatedFields: {
          name: "Homem Aranha",
          note: 7.5,
          comment: "Filme ok!!!",
        },
      });
    }).rejects.toThrowError("Nenhuma avaliação encontrada");
  });
});
