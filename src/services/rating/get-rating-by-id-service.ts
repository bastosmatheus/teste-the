import { NotFoundError } from "../../errors/not-found-error";
import { RatingRepository } from "../../repositories/rating-repository";

type GetRatingByIdServiceRequest = {
  id: number;
};

class GetRatingByIdService {
  constructor(private readonly ratingRepository: RatingRepository) {}

  public async execute({ id }: GetRatingByIdServiceRequest) {
    const rating = await this.ratingRepository.getById(id);

    if (!rating) {
      throw new NotFoundError("Nenhuma avaliação encontrada");
    }

    return rating;
  }
}

export { GetRatingByIdService };
