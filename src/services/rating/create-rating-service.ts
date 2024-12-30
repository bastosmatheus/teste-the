import { NotFoundError } from "../../errors/not-found-error";
import { MovieRepository } from "../../repositories/movie-repository";
import { RatingRepository } from "../../repositories/rating-repository";

type CreateRatingServiceRequest = {
  name: string;
  note: number;
  comment: string;
  id_movie: number;
};

class CreateRatingService {
  constructor(
    private readonly ratingRepository: RatingRepository,
    private readonly movieRepository: MovieRepository
  ) {}

  public async execute({
    name,
    note,
    comment,
    id_movie,
  }: CreateRatingServiceRequest) {
    const movieExists = await this.movieRepository.getById(id_movie);

    if (!movieExists) {
      throw new NotFoundError("Nenhum filme encontrado");
    }

    const rating = await this.ratingRepository.create({
      name,
      note,
      comment,
      id_movie,
    });

    return rating;
  }
}

export { CreateRatingService };
