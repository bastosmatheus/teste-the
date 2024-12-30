import { Movie } from "../entities/movie";
import { DatabaseConnection } from "../database/database-connection";
import { MovieRepository } from "./movie-repository";
import { Pool, RowDataPacket } from "mysql2/promise";
import { Rating } from "../entities/rating";

interface MovieFromDatabase extends RowDataPacket {
  id: number;
  title: string;
  year: number;
  synopsis: string;
  genres: string;
  director: string;
  actors: string;
  ratings: Rating[];
}

class MovieRepositoryDatabase implements MovieRepository {
  private readonly connection: Pool;

  constructor(private readonly databaseConnection: DatabaseConnection) {
    this.connection = this.databaseConnection.connect();
  }

  public async getAll(): Promise<Movie[]> {
    const [movies] = await this.connection.query<MovieFromDatabase[]>(
      `
      SELECT 
      movies.*,
      COALESCE(
        JSON_ARRAYAGG(
          CASE
            WHEN ratings.id IS NOT NULL THEN
              JSON_OBJECT(
                'id', ratings.id,
                'name', ratings.name,
                'note', ratings.note,
                'comment', ratings.comment
              )
          END
        ),
        JSON_ARRAY()
      ) AS ratings
      FROM 
        movies
      LEFT JOIN  
        ratings ON movies.id = ratings.id_movie
      GROUP BY 
        movies.id`,
      []
    );

    return movies;
  }

  public async getMoviesByTitle(title: string): Promise<Movie[]> {
    const [movies] = await this.connection.query<MovieFromDatabase[]>(
      `
      SELECT 
      movies.*,
      COALESCE(
        JSON_ARRAYAGG(
          CASE
            WHEN ratings.id IS NOT NULL THEN
              JSON_OBJECT(
                'id', ratings.id,
                'name', ratings.name,
                'note', ratings.note,
                'comment', ratings.comment
              )
          END
        ),
        JSON_ARRAY()
      ) AS ratings
      FROM 
        movies
      LEFT JOIN 
        ratings ON movies.id = ratings.id_movie
      WHERE 
        movies.title LIKE ?
      GROUP BY
        movies.id`,
      [`%${title}%`]
    );

    return movies;
  }

  public async getByTitle(title: string): Promise<Movie | null> {
    const [movie] = await this.connection.query<MovieFromDatabase[]>(
      `
      SELECT 
      movies.*,
      COALESCE(
        JSON_ARRAYAGG(
          CASE
            WHEN ratings.id IS NOT NULL THEN
              JSON_OBJECT(
                'id', ratings.id,
                'name', ratings.name,
                'note', ratings.note,
                'comment', ratings.comment
              )
          END
        ),
        JSON_ARRAY()
      ) AS ratings
      FROM 
        movies
      LEFT JOIN 
        ratings ON movies.id = ratings.id_movie
      WHERE 
        movies.title = ?
      GROUP BY
        movies.title`,
      [title]
    );

    if (!movie[0]) {
      return null;
    }

    return movie[0];
  }

  public async getById(id: number): Promise<Movie | null> {
    const [movie] = await this.connection.query<MovieFromDatabase[]>(
      `
      SELECT 
      movies.*,
      COALESCE(
        JSON_ARRAYAGG(
          CASE
            WHEN ratings.id IS NOT NULL THEN
              JSON_OBJECT(
                'id', ratings.id,
                'name', ratings.name,
                'note', ratings.note,
                'comment', ratings.comment
              )
          END
        ), 
        JSON_ARRAY()
      ) AS ratings
      FROM 
        movies
      LEFT JOIN 
        ratings ON movies.id = ratings.id_movie
      WHERE 
        movies.id = ?
      GROUP BY
        movies.id`,
      [id]
    );

    if (!movie[0]) {
      return null;
    }

    return movie[0];
  }

  public async create(movie: Movie): Promise<Movie> {
    await this.connection.query<MovieFromDatabase[]>(
      "INSERT INTO movies (title, year, synopsis, genres, director, actors) VALUES (?, ?, ?, ?, ?, ?)",
      [
        movie.title,
        movie.year,
        movie.synopsis,
        movie.genres,
        movie.director,
        movie.actors,
      ]
    );

    const [movieCreated] = await this.connection.query<MovieFromDatabase[]>(
      "SELECT * FROM movies WHERE id = LAST_INSERT_ID()",
      []
    );

    return movieCreated[0];
  }

  public async update(movie: Movie): Promise<Movie> {
    await this.connection.query<MovieFromDatabase[]>(
      "UPDATE movies SET title = ?, year = ?, synopsis = ?, genres = ?, director = ?, actors = ? WHERE id = ?",
      [
        movie.title,
        movie.year,
        movie.synopsis,
        movie.genres,
        movie.director,
        movie.actors,
        movie.id,
      ]
    );

    const [movieUpdated] = await this.connection.query<MovieFromDatabase[]>(
      `
      SELECT 
      movies.*,
      COALESCE(
        JSON_ARRAYAGG(
          CASE
            WHEN ratings.id IS NOT NULL THEN
              JSON_OBJECT(
                'id', ratings.id,
                'name', ratings.name,
                'note', ratings.note,
                'comment', ratings.comment
              )
          END
        ),
        JSON_ARRAY()
      ) AS ratings
      FROM 
        movies
      LEFT JOIN 
        ratings ON movies.id = ratings.id_movie
      WHERE 
        movies.id = ?
      GROUP BY 
        movies.id`,
      [movie.id]
    );

    return movieUpdated[0];
  }

  public async delete(id: number): Promise<Movie> {
    const [movie] = await this.connection.query<MovieFromDatabase[]>(
      `
      SELECT 
      movies.*,
      COALESCE(
        JSON_ARRAYAGG(
          CASE
            WHEN ratings.id IS NOT NULL THEN
              JSON_OBJECT(
                'id', ratings.id,
                'name', ratings.name,
                'note', ratings.note,
                'comment', ratings.comment
              )
          END
        ),
        JSON_ARRAY()
      ) AS ratings
      FROM 
        movies
      LEFT JOIN 
        ratings ON movies.id = ratings.id_movie
      WHERE 
        movies.id = ?
      GROUP BY 
        movies.id`,
      [id]
    );

    await this.connection.query<MovieFromDatabase[]>(
      "DELETE FROM movies WHERE id = ?",
      [id]
    );

    return movie[0];
  }
}

export { MovieRepositoryDatabase };
