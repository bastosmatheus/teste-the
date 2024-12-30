import { describe, test, expect, beforeEach } from "vitest";
import { InMemoryMovieRepository } from "../../repositories/in-memory/in-memory-movie-repository";
import { CreateMovieService } from "./create-movie-service";
import { GetMoviesByTitleService } from "./get-movies-by-title-service";

let movieRepository: InMemoryMovieRepository;
let getMoviesByTitleService: GetMoviesByTitleService;
let createMovieService: CreateMovieService;

describe("Teste unitário para retornar um filme no banco de dados", () => {
  beforeEach(() => {
    // mock do banco de dados
    movieRepository = new InMemoryMovieRepository();

    createMovieService = new CreateMovieService(movieRepository);

    getMoviesByTitleService = new GetMoviesByTitleService(movieRepository);
  });

  test("Deve retornar todos os filmes do banco de dados que contenha o título informado", async () => {
    await createMovieService.execute({
      title: "The Avengers",
    });

    const moviea = await createMovieService.execute({
      title: "The Batman",
    });

    const movie = await getMoviesByTitleService.execute({
      title: "The",
    });

    expect(movie).toBeTruthy();
    expect(movie).toHaveLength(2);
  });
});
