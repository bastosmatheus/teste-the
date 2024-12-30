class NotFoundError extends Error {
  public readonly message: string;
  public readonly statusCode: number = 404;

  constructor(message: string) {
    super(message);

    this.message = message;
  }
}

export { NotFoundError };
