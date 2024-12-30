import { MovieRepository } from "../../repositories/movie-repository";

type GetMoviesByTitleServiceRequest = {
  title: string;
};

class GetMoviesByTitleService {
  constructor(private readonly movieRepository: MovieRepository) {}

  public async execute({ title }: GetMoviesByTitleServiceRequest) {
    const movie = await this.movieRepository.getMoviesByTitle(title);

    return movie;
  }
}

export { GetMoviesByTitleService };
