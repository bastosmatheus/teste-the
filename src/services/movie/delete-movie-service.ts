import { NotFoundError } from "../../errors/not-found-error";
import { MovieRepository } from "../../repositories/movie-repository";

type DeleteMovieServiceRequest = {
  id: number;
};

class DeleteMovieService {
  constructor(private readonly movieRepositoy: MovieRepository) {}

  public async execute({ id }: DeleteMovieServiceRequest) {
    const movieExists = await this.movieRepositoy.getById(id);

    if (!movieExists) {
      throw new NotFoundError("Nenhum filme encontrado");
    }

    const movie = await this.movieRepositoy.delete(id);

    return movie;
  }
}

export { DeleteMovieService };
