import { describe, test, expect, beforeEach } from "vitest";
import { DeleteMovieService } from "./delete-movie-service";
import { InMemoryMovieRepository } from "../../repositories/in-memory/in-memory-movie-repository";
import { CreateMovieService } from "./create-movie-service";

let movieRepository: InMemoryMovieRepository;
let deleteMovieService: DeleteMovieService;
let createMovieService: CreateMovieService;

describe("Teste unitário para exclusão de um filme no banco de dados", () => {
  beforeEach(() => {
    // mock do banco de dados
    movieRepository = new InMemoryMovieRepository();

    createMovieService = new CreateMovieService(movieRepository);

    deleteMovieService = new DeleteMovieService(movieRepository);
  });

  test("Deve ser possível fazer a exclusão de um filme", async () => {
    const movieCreated = await createMovieService.execute({
      title: "The Avengers",
    });

    const movie = await deleteMovieService.execute({
      id: 1,
    });

    expect(movie).toBeTruthy();
  });

  test("Não deve fazer a exclusão se nenhum filme for encontrado", async () => {
    const movieCreated = await createMovieService.execute({
      title: "The Avengers",
    });

    await expect(async () => {
      await deleteMovieService.execute({
        id: 2,
      });
    }).rejects.toThrow("Nenhum filme encontrado");
  });
});
