import { Rating } from "../../entities/rating";
import { RatingRepository } from "../rating-repository";

class InMemoryRatingRepository implements RatingRepository {
  private ratings: Rating[] = [];

  public async getAll(): Promise<Rating[]> {
    return this.ratings;
  }

  public async getById(id: number): Promise<Rating | null> {
    const rating = this.ratings.find((rating) => rating.id === id);

    if (!rating) {
      return null;
    }

    return rating;
  }

  public async create(rating: Rating): Promise<Rating> {
    rating.id = this.ratings.length + 1;

    this.ratings.push(rating);

    return rating;
  }

  public async update(rating: Rating): Promise<Rating> {
    const ratingIndex = this.ratings.findIndex(
      (rating) => rating.id === rating.id
    );

    this.ratings[ratingIndex] = rating;

    return this.ratings[ratingIndex];
  }

  public async delete(id: number): Promise<Rating> {
    const ratingIndex = this.ratings.findIndex((rating) => rating.id === id);

    const [rating] = this.ratings.splice(ratingIndex, 1);

    return rating;
  }
}

export { InMemoryRatingRepository };
