import { MovieRepository } from "../../repositories/movie-repository";

class GetAllMoviesService {
  constructor(private readonly movieRepository: MovieRepository) {}

  public async execute() {
    const movies = await this.movieRepository.getAll();

    return movies;
  }
}

export { GetAllMoviesService };
