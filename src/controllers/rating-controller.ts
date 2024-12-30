import { Request, Response } from "express";
import { z } from "zod";
import { RatingRepository } from "../repositories/rating-repository";
import { GetAllRatingsService } from "../services/rating/get-all-ratings-service";
import { GetRatingByIdService } from "../services/rating/get-rating-by-id-service";
import { CreateRatingService } from "../services/rating/create-rating-service";
import { MovieRepository } from "../repositories/movie-repository";
import { UpdateRatingService } from "../services/rating/update-rating-service";
import { DeleteRatingService } from "../services/rating/delete-rating-service";

class RatingController {
  constructor(
    private readonly ratingRepository: RatingRepository,
    private readonly movieRepository: MovieRepository
  ) {}

  public async getAllRatings(request: Request, response: Response) {
    const ratings = await new GetAllRatingsService(
      this.ratingRepository
    ).execute();

    return response.status(200).json({
      statusCode: 200,
      ratings,
    });
  }

  public async getRatingById(request: Request, response: Response) {
    const getRatingByIdSchema = z.object({
      id: z
        .number({
          invalid_type_error: "O ID deve ser um número",
          required_error: "Informe o ID",
        })
        .min(1, { message: "Informe um ID válido" }),
    });

    const { id } = request.params;

    getRatingByIdSchema.parse({ id: Number(id) });

    const getRatingByIdService = new GetRatingByIdService(
      this.ratingRepository
    );

    const rating = await getRatingByIdService.execute({ id: Number(id) });

    return response.status(200).json({
      statusCode: 200,
      rating,
    });
  }

  public async createRating(request: Request, response: Response) {
    const createRatingSchema = z.object({
      name: z
        .string({
          invalid_type_error: "O nome do avaliador deve ser uma string",
          required_error: "Informe o nome do avaliador",
        })
        .min(2, { message: "Informe um nome válido (mínimo 2 caracteres)" })
        .max(100, { message: "O nome deve ter no máximo 100 caracteres" }),
      note: z
        .number({
          invalid_type_error: "A nota do filme deve ser um número",
          required_error: "Informe a nota do filme",
        })
        .min(1, { message: "Informe uma nota válida (1 até 10)" })
        .max(10, { message: "Informe uma nota válida (1 até 10)" }),
      comment: z
        .string({
          invalid_type_error: "O comentário deve ser uma string",
          required_error: "Informe o comentário",
        })
        .min(5, { message: "Faça um comentário válido (mínimo 5 caracteres)" })
        .max(255, {
          message: "O comentário deve ter no máximo 255 caracteres",
        }),
      id_movie: z
        .number({
          invalid_type_error: "O ID do filme deve ser um número",
          required_error: "Informe o ID do filme",
        })
        .min(1, { message: "Informe um ID de filme válido" }),
    });

    const { name, note, comment, id_movie } = request.body;

    createRatingSchema.parse({ name, note, comment, id_movie });

    const createRatingService = new CreateRatingService(
      this.ratingRepository,
      this.movieRepository
    );

    const rating = await createRatingService.execute({
      name,
      note,
      comment,
      id_movie,
    });

    return response.status(201).json({
      statusCode: 201,
      rating,
    });
  }

  public async updateRating(request: Request, response: Response) {
    const updateRatingSchema = z
      .object({
        id: z
          .number({
            invalid_type_error: "O ID deve ser um número",
            required_error: "Informe o ID",
          })
          .min(1, { message: "Informe um ID válido" }),
        name: z
          .string({
            invalid_type_error: "O nome do avaliador deve ser uma string",
            required_error: "Informe o nome do avaliador",
          })
          .min(2, { message: "Informe um nome válido (mínimo 2 caracteres)" })
          .max(100, { message: "O nome deve ter no máximo 100 caracteres" })
          .optional(),
        note: z
          .number({
            invalid_type_error: "A nota do filme deve ser um número",
            required_error: "Informe a nota do filme",
          })
          .min(1, { message: "Informe uma nota válida (1 até 10)" })
          .max(10, { message: "Informe uma nota válida (1 até 10)" })
          .optional(),
        comment: z
          .string({
            invalid_type_error: "O comentário deve ser uma string",
            required_error: "Informe o comentário",
          })
          .min(5, {
            message: "Faça um comentário válido (mínimo 5 caracteres)",
          })
          .max(255, {
            message: "O comentário deve ter no máximo 255 caracteres",
          })
          .optional(),
      })
      .strict();

    const { id } = request.params;
    const updatedFields = request.body;

    updateRatingSchema.parse({ id: Number(id), ...updatedFields });

    const updateRatingService = new UpdateRatingService(this.ratingRepository);

    const rating = await updateRatingService.execute({
      id: Number(id),
      updatedFields,
    });

    return response.status(200).json({
      statusCode: 200,
      rating,
    });
  }

  public async deleteRating(request: Request, response: Response) {
    const deleteRatingSchema = z.object({
      id: z
        .number({
          invalid_type_error: "O ID deve ser um número",
          required_error: "Informe o ID",
        })
        .min(1, { message: "Informe um ID válido" }),
    });

    const { id } = request.params;

    deleteRatingSchema.parse({ id: Number(id) });

    const deleteRatingService = new DeleteRatingService(this.ratingRepository);

    const rating = await deleteRatingService.execute({ id: Number(id) });

    return response.status(200).json({
      statusCode: 200,
      rating,
    });
  }
}

export { RatingController };
