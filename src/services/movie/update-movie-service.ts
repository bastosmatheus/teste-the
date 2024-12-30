import { Movie } from "../../entities/movie";
import { NotFoundError } from "../../errors/not-found-error";
import { MovieRepository } from "../../repositories/movie-repository";

type UpdateMovieServiceRequest = {
  id: number;
  updatedFields: Partial<
    Pick<Movie, "year" | "synopsis" | "director"> & {
      genres?: string[];
      actors?: string[];
    }
  >;
};

class UpdateMovieService {
  constructor(private readonly movieRepository: MovieRepository) {}

  public async execute({ id, updatedFields }: UpdateMovieServiceRequest) {
    const movieExists = await this.movieRepository.getById(id);

    if (!movieExists) {
      throw new NotFoundError("Nenhum filme encontrado");
    }

    Object.assign(movieExists, updatedFields);

    updatedFields.genres
      ? (movieExists.genres = updatedFields.genres.join(", "))
      : movieExists.genres;

    updatedFields.actors
      ? (movieExists.actors = updatedFields.actors.join(", "))
      : movieExists.actors;

    const movie = await this.movieRepository.update(movieExists);

    return movie;
  }
}

export { UpdateMovieService };
