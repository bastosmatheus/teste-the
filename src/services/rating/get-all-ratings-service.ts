import { RatingRepository } from "../../repositories/rating-repository";

class GetAllRatingsService {
  constructor(private readonly ratingRepository: RatingRepository) {}

  public async execute() {
    const ratings = await this.ratingRepository.getAll();

    return ratings;
  }
}

export { GetAllRatingsService };
