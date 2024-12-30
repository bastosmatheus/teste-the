import { NotFoundError } from "../../errors/not-found-error";
import { RatingRepository } from "../../repositories/rating-repository";

type DeleteRatingServiceRequest = {
  id: number;
};

class DeleteRatingService {
  constructor(private readonly ratingRepository: RatingRepository) {}

  public async execute({ id }: DeleteRatingServiceRequest) {
    const ratingExists = await this.ratingRepository.getById(id);

    if (!ratingExists) {
      throw new NotFoundError("Nenhuma avaliação encontrada");
    }

    const rating = await this.ratingRepository.delete(id);

    return rating;
  }
}

export { DeleteRatingService };
