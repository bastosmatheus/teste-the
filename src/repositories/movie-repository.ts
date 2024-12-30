import { Movie } from "../entities/movie";

interface MovieRepository {
  getAll(): Promise<Movie[]>;
  getMoviesByTitle(title: string): Promise<Movie[]>;
  getByTitle(title: string): Promise<Movie | null>;
  getById(id: number): Promise<Movie | null>;
  create(movie: Movie): Promise<Movie>;
  update(movie: Movie): Promise<Movie>;
  delete(id: number): Promise<Movie>;
}

export { MovieRepository };
