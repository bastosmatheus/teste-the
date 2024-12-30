import { describe, test, expect, beforeEach } from "vitest";
import { CreateMovieService } from "./create-movie-service";
import { InMemoryMovieRepository } from "../../repositories/in-memory/in-memory-movie-repository";
import { GetAllMoviesService } from "./get-all-movies-service";

let movieRepository: InMemoryMovieRepository;
let createMovieService: CreateMovieService;
let getAllMoviesService: GetAllMoviesService;

describe("Teste unitário para pegar todos os filmes no banco de dados", () => {
  beforeEach(() => {
    // mock do banco de dados
    movieRepository = new InMemoryMovieRepository();

    createMovieService = new CreateMovieService(movieRepository);

    getAllMoviesService = new GetAllMoviesService(movieRepository);
  });

  test("Deve retornar todos os filmes do banco de dados", async () => {
    await createMovieService.execute({
      title: "The Avengers",
    });

    await createMovieService.execute({
      title: "Dunas",
    });

    const movies = await getAllMoviesService.execute();

    expect(movies).toBeTruthy();
    expect(movies).toHaveLength(2);
  });
});
