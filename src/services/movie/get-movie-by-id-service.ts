import { NotFoundError } from "../../errors/not-found-error";
import { MovieRepository } from "../../repositories/movie-repository";

type GetMovieByIdServiceRequest = {
  id: number;
};

class GetMovieByIdService {
  constructor(private readonly movieRepository: MovieRepository) {}

  public async execute({ id }: GetMovieByIdServiceRequest) {
    const movie = await this.movieRepository.getById(id);

    if (!movie) {
      throw new NotFoundError("Nenhum filme encontrado");
    }

    return movie;
  }
}

export { GetMovieByIdService };
