import { describe, test, expect, beforeEach } from "vitest";
import { CreateMovieService } from "./create-movie-service";
import { InMemoryMovieRepository } from "../../repositories/in-memory/in-memory-movie-repository";
import { UpdateMovieService } from "./update-movie-service";

let movieRepository: InMemoryMovieRepository;
let createMovieService: CreateMovieService;
let updateMovieService: UpdateMovieService;

describe("Teste unitário para atualização de um filme no banco de dados", () => {
  beforeEach(() => {
    // mock do banco de dados
    movieRepository = new InMemoryMovieRepository();

    createMovieService = new CreateMovieService(movieRepository);

    updateMovieService = new UpdateMovieService(movieRepository);
  });

  test("Deve ser possível fazer a atualização se existir um filme com o ID informado", async () => {
    await createMovieService.execute({
      title: "The Avengers",
    });

    const movie = await updateMovieService.execute({
      id: 1,
      updatedFields: {
        genres: ["Comédia"],
        actors: ["Tony Stark"],
      },
    });

    expect(movie).toBeTruthy();
  });

  test("Não deve fazer a atualização se nenhum filme for encontrado", async () => {
    await createMovieService.execute({
      title: "The Avengers",
    });

    await expect(
      async () =>
        await updateMovieService.execute({
          id: 2,
          updatedFields: {
            director: "Jack Chan",
          },
        })
    ).rejects.toThrowError("Nenhum filme encontrado");
  });
});
