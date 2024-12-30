import { BadRequestError } from "../../errors/bad-request-error";
import { ConflictError } from "../../errors/conflict-error";
import { MovieRepository } from "../../repositories/movie-repository";
import { configDotenv } from "dotenv";

configDotenv();

type CreateMovieServiceRequest = {
  title: string;
};

type ResponseApi = {
  Error?: string;
  Title: string;
  Year: number;
  Plot: string;
  Genre: string;
  Director: string;
  Actors: string;
};

class CreateMovieService {
  constructor(private readonly movieRepository: MovieRepository) {}

  public async execute({ title }: CreateMovieServiceRequest) {
    const movieAlreadyExists = await this.movieRepository.getByTitle(title);

    if (movieAlreadyExists) {
      throw new ConflictError("Esse filme já está cadastrado");
    }

    const response = await fetch(
      `http://www.omdbapi.com/?apikey=${process.env.API_KEY}&t=${title}`
    );

    const data = (await response.json()) as ResponseApi;

    if ("Error" in data) {
      throw new BadRequestError(
        "Esse filme não existe no nosso banco de dados"
      );
    }

    const movie = await this.movieRepository.create({
      title: data.Title,
      year: data.Year,
      synopsis: data.Plot,
      genres: data.Genre,
      director: data.Director,
      actors: data.Actors,
    });

    return movie;
  }
}

export { CreateMovieService };
