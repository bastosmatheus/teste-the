import { Movie } from "../../entities/movie";
import { MovieRepository } from "../movie-repository";

class InMemoryMovieRepository implements MovieRepository {
  private movies: Movie[] = [];

  public async getAll(): Promise<Movie[]> {
    return this.movies;
  }

  public async getMoviesByTitle(title: string): Promise<Movie[]> {
    const movies = this.movies.filter((movie) => {
      return movie.title.includes(title.trim());
    });

    return movies;
  }

  public async getByTitle(title: string): Promise<Movie | null> {
    const movie = this.movies.find((movie) => movie.title === title);

    if (!movie) {
      return null;
    }

    return movie;
  }

  public async getById(id: number): Promise<Movie | null> {
    const movie = this.movies.find((movie) => movie.id === id);

    if (!movie) {
      return null;
    }

    return movie;
  }

  public async create(movie: Movie): Promise<Movie> {
    movie.id = this.movies.length + 1;

    this.movies.push(movie);

    return movie;
  }

  public async update(movie: Movie): Promise<Movie> {
    const movieIndex = this.movies.findIndex((movie) => movie.id === movie.id);

    this.movies[movieIndex] = movie;

    return this.movies[movieIndex];
  }

  public async delete(id: number): Promise<Movie> {
    const movieIndex = this.movies.findIndex((movie) => movie.id === id);

    const [movie] = this.movies.slice(movieIndex, 1);

    return movie;
  }
}

export { InMemoryMovieRepository };
