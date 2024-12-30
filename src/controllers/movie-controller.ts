import { Request, Response } from "express";
import { MovieRepository } from "../repositories/movie-repository";
import { z } from "zod";
import { GetMovieByIdService } from "../services/movie/get-movie-by-id-service";
import { GetMoviesByTitleService } from "../services/movie/get-movies-by-title-service";
import { CreateMovieService } from "../services/movie/create-movie-service";
import { DeleteMovieService } from "../services/movie/delete-movie-service";
import { GetAllMoviesService } from "../services/movie/get-all-movies-service";
import { UpdateMovieService } from "../services/movie/update-movie-service";

class MovieController {
  constructor(private readonly movieRepository: MovieRepository) {}

  public async getAllMovies(request: Request, response: Response) {
    const movies = await new GetAllMoviesService(
      this.movieRepository
    ).execute();

    return response.status(200).json({
      statusCode: 200,
      movies,
    });
  }

  public async getMoviesByTitle(request: Request, response: Response) {
    const getMoviesByTitleSchema = z.object({
      title: z
        .string({
          invalid_type_error: "O título do filme deve ser uma string",
          required_error: "Informe o título do filme",
        })
        .min(2, { message: "Informe um título válido (mínimo 2 caracteres)" }),
    });

    const { title } = request.query;

    getMoviesByTitleSchema.parse({ title: String(title) });

    const getMoviesByTitleService = new GetMoviesByTitleService(
      this.movieRepository
    );

    const movies = await getMoviesByTitleService.execute({
      title: String(title),
    });

    return response.status(200).json({
      statusCode: 200,
      movies,
    });
  }

  public async getMovieById(request: Request, response: Response) {
    const getMovieByIdSchema = z.object({
      id: z
        .number({
          invalid_type_error: "O ID deve ser um número",
          required_error: "Informe o ID",
        })
        .min(1, { message: "Informe um ID válido" }),
    });

    const { id } = request.params;

    getMovieByIdSchema.parse({ id: Number(id) });

    const getMovieByIdService = new GetMovieByIdService(this.movieRepository);

    const movie = await getMovieByIdService.execute({ id: Number(id) });

    return response.status(200).json({
      statusCode: 200,
      movie,
    });
  }

  public async createMovie(request: Request, response: Response) {
    const createMovieSchema = z.object({
      title: z
        .string({
          invalid_type_error: "O título do filme deve ser uma string",
          required_error: "Informe o título do filme",
        })
        .min(2, { message: "Informe um título válido (mínimo 2 caracteres)" })
        .max(100, { message: "O título deve ter no máximo 100 caracteres" }),
    });

    const { title } = request.body;

    createMovieSchema.parse({ title });

    const createMovieService = new CreateMovieService(this.movieRepository);

    const movie = await createMovieService.execute({ title });

    return response.status(201).json({
      statusCode: 201,
      movie,
    });
  }

  public async updateMovie(request: Request, response: Response) {
    const currentYear = new Date().getFullYear();

    const updateMovieSchema = z
      .object({
        id: z
          .number({
            invalid_type_error: "O ID deve ser um número",
            required_error: "Informe o ID",
          })
          .min(1, { message: "Informe um ID válido" }),
        year: z
          .number({
            invalid_type_error: "O ano de lançamento deve ser um número",
            required_error: "Informe ano de lançamento do filme",
          })
          .min(1900, {
            message: "Informe um ano de lançamento válido (mínimo 1900)",
          })
          .max(currentYear, {
            message: `Informe um ano de lançamento válido (máximo ${currentYear})`,
          })
          .optional(),
        synopsis: z
          .string({
            invalid_type_error: "A sinopse do filme deve ser uma string",
            required_error: "Informe a sinopse do filme",
          })
          .min(2, {
            message: "Informe uma sinopse válida (mínimo 2 caracteres)",
          })
          .max(255, { message: "A sinopse deve ter no máximo 255 caracteres" })
          .optional(),
        genres: z
          .array(
            z.string({
              invalid_type_error: "Os gêneros do filme devem ser string",
              required_error: "Informe os gêneros do filme",
            })
          )
          .min(1, { message: "Informe pelo menos 1 gênero do filme" })
          .max(10, { message: "O máximo de gêneros é 10" })
          .optional(),
        director: z
          .string({
            invalid_type_error: "O nome do diretor deve ser uma string",
            required_error: "Informe o diretor do filme",
          })
          .min(2, {
            message: "Informe um nome de diretor válido (mínimo 2 caracteres)",
          })
          .max(170, {
            message: "O nome do diretor deve ter no máximo 170 caracteres",
          })
          .optional(),
        actors: z
          .array(
            z.string({
              invalid_type_error: "O nome dos atores devem ser uma string",
              required_error: "Informe os atores do filme",
            })
          )
          .min(1, { message: "Informe pelo menos 1 ator do filme" })
          .max(12, { message: "O máximo de atores é 12" })
          .optional(),
      })
      .strict();

    const { id } = request.params;
    const updatedFields = request.body;

    updateMovieSchema.parse({ id: Number(id), ...updatedFields });

    const updateMovieService = new UpdateMovieService(this.movieRepository);

    const movie = await updateMovieService.execute({
      id: Number(id),
      updatedFields,
    });

    return response.status(200).json({
      statusCode: 200,
      movie,
    });
  }

  public async deleteMovie(request: Request, response: Response) {
    const deleteMovieSchema = z.object({
      id: z
        .number({
          invalid_type_error: "O ID deve ser um número",
          required_error: "Informe o ID",
        })
        .min(1, { message: "Informe um ID válido" }),
    });

    const { id } = request.params;

    deleteMovieSchema.parse({ id: Number(id) });

    const deleteMovieService = new DeleteMovieService(this.movieRepository);

    const movie = await deleteMovieService.execute({ id: Number(id) });

    return response.status(200).json({
      statusCode: 200,
      movie,
    });
  }
}

export { MovieController };
