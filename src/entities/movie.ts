import { Rating } from "./rating";

interface Movie {
  id?: number;
  title: string;
  year: number;
  synopsis: string;
  genres: string;
  director: string;
  actors: string;
  ratings?: Rating[];
}

export { Movie };
