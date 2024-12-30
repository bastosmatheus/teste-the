import { Pool, RowDataPacket } from "mysql2/promise";
import { DatabaseConnection } from "../database/database-connection";
import { RatingRepository } from "./rating-repository";
import { Rating } from "../entities/rating";

interface RatingFromDatabase extends RowDataPacket {
  id: number;
  name: string;
  note: number;
  comment: string;
  id_movie: number;
}

class RatingRepositoryDatabase implements RatingRepository {
  private readonly connection: Pool;

  constructor(private readonly databaseConnection: DatabaseConnection) {
    this.connection = this.databaseConnection.connect();
  }

  public async getAll(): Promise<Rating[]> {
    const [ratings] = await this.connection.query<RatingFromDatabase[]>(
      "SELECT * FROM ratings",
      []
    );

    return ratings;
  }

  public async getById(id: number): Promise<Rating | null> {
    const [rating] = await this.connection.query<RatingFromDatabase[]>(
      "SELECT * FROM ratings WHERE id = ?",
      [id]
    );

    if (!rating[0]) {
      return null;
    }

    return rating[0];
  }

  public async create(rating: Rating): Promise<Rating> {
    await this.connection.query<RatingFromDatabase[]>(
      "INSERT INTO ratings (name, note, comment, id_movie) VALUES (?, ?, ?, ?)",
      [rating.name, rating.note, rating.comment, rating.id_movie]
    );

    const [ratingCreated] = await this.connection.query<RatingFromDatabase[]>(
      "SELECT * FROM ratings WHERE id = LAST_INSERT_ID()",
      []
    );

    return ratingCreated[0];
  }

  public async update(rating: Rating): Promise<Rating> {
    await this.connection.query<RatingFromDatabase[]>(
      "UPDATE ratings SET name = ?, note = ?, comment = ? WHERE id = ?",
      [rating.name, rating.note, rating.comment, rating.id]
    );

    const [ratingUpdated] = await this.connection.query<RatingFromDatabase[]>(
      "SELECT * FROM ratings WHERE id = ?",
      [rating.id]
    );

    return ratingUpdated[0];
  }

  public async delete(id: number): Promise<Rating> {
    const [rating] = await this.connection.query<RatingFromDatabase[]>(
      "SELECT * FROM ratings WHERE id = ?",
      [id]
    );

    await this.connection.query<RatingFromDatabase[]>(
      "DELETE FROM ratings WHERE id = ?",
      [id]
    );

    return rating[0];
  }
}

export { RatingRepositoryDatabase };
