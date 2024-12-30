import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

function errorHandler(
  error: unknown,
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (error instanceof ZodError) {
    const errorFormatted = error.errors[0];

    response.status(400).json({
      statusCode: 400,
      message:
        errorFormatted.code === "unrecognized_keys"
          ? `Chave(s) não reconhecida(s) no objeto: ${errorFormatted.keys}`
          : errorFormatted.message,
    });

    return;
  }

  if (error instanceof Error) {
    response.status(error.statusCode).json({
      statusCode: error.statusCode,
      message: error.message,
    });

    return;
  }

  response.status(500).json({
    message: "Erro Interno do Servidor",
    statusCode: 500,
  });
}

export { errorHandler };
