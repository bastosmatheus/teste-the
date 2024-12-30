import { Rating } from "../entities/rating";

interface RatingRepository {
  getAll(): Promise<Rating[]>;
  getById(id: number): Promise<Rating | null>;
  create(rating: Rating): Promise<Rating>;
  update(rating: Rating): Promise<Rating>;
  delete(id: number): Promise<Rating>;
}

export { RatingRepository };
