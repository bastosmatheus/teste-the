class BadRequestError extends Error {
  public readonly message: string;
  public readonly statusCode: number = 400;

  constructor(message: string) {
    super(message);

    this.message = message;
  }
}

export { BadRequestError };
