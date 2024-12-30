import { Rating } from "../../entities/rating";
import { NotFoundError } from "../../errors/not-found-error";
import { RatingRepository } from "../../repositories/rating-repository";

type UpdateRatingServiceRequest = {
  id: number;
  updatedFields: Partial<Omit<Rating, "id" | "id_movie">>;
};

class UpdateRatingService {
  constructor(private readonly ratingRepository: RatingRepository) {}

  public async execute({ id, updatedFields }: UpdateRatingServiceRequest) {
    const ratingExists = await this.ratingRepository.getById(id);

    if (!ratingExists) {
      throw new NotFoundError("Nenhuma avaliação encontrada");
    }

    Object.assign(ratingExists, updatedFields);

    const rating = await this.ratingRepository.update(ratingExists);

    return rating;
  }
}

export { UpdateRatingService };
