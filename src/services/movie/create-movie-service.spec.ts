import { describe, test, expect, beforeEach } from "vitest";
import { CreateMovieService } from "./create-movie-service";
import { InMemoryMovieRepository } from "../../repositories/in-memory/in-memory-movie-repository";

let movieRepository: InMemoryMovieRepository;
let createMovieService: CreateMovieService;

describe("Teste unitário para criação de um filme no banco de dados", () => {
  beforeEach(() => {
    // mock do banco de dados
    movieRepository = new InMemoryMovieRepository();

    createMovieService = new CreateMovieService(movieRepository);
  });

  test("Deve ser possível fazer a criação de um filme", async () => {
    const movie = await createMovieService.execute({
      title: "The Avengers",
    });

    expect(movie).toBeTruthy();
  });

  test("Não deve fazer a criação se nenhum filme for encontrado", async () => {
    await expect(() =>
      createMovieService.execute({
        title: "ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ",
      })
    ).rejects.toThrowError("Esse filme não existe no nosso banco de dados");
  });

  test("Não deve fazer a criação se o filme já foi cadastrado anteriormente", async () => {
    await createMovieService.execute({
      title: "The Avengers",
    });

    await expect(async () => {
      await createMovieService.execute({
        title: "The Avengers",
      });
    }).rejects.toThrowError("Esse filme já está cadastrado");
  });
});
