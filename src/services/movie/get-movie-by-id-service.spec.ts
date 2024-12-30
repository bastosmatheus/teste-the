import { describe, test, expect, beforeEach } from "vitest";
import { InMemoryMovieRepository } from "../../repositories/in-memory/in-memory-movie-repository";
import { CreateMovieService } from "./create-movie-service";
import { GetMovieByIdService } from "./get-movie-by-id-service";

let movieRepository: InMemoryMovieRepository;
let getMovieByIdService: GetMovieByIdService;
let createMovieService: CreateMovieService;

describe("Teste unitário para retornar um filme no banco de dados", () => {
  beforeEach(() => {
    // mock do banco de dados
    movieRepository = new InMemoryMovieRepository();

    createMovieService = new CreateMovieService(movieRepository);

    getMovieByIdService = new GetMovieByIdService(movieRepository);
  });

  test("Deve retornar um filme se existir algum com o ID informado", async () => {
    const movieCreated = await createMovieService.execute({
      title: "The Avengers",
    });

    const movie = await getMovieByIdService.execute({
      id: 1,
    });

    expect(movie).toBeTruthy();
  });

  test("Não deve retornar se nenhum filme for encontrado", async () => {
    const movieCreated = await createMovieService.execute({
      title: "The Avengers",
    });

    await expect(async () => {
      await getMovieByIdService.execute({
        id: 2,
      });
    }).rejects.toThrow("Nenhum filme encontrado");
  });
});
