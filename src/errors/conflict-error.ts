class ConflictError extends Error {
  public readonly message: string;
  public readonly statusCode: number = 409;

  constructor(message: string) {
    super(message);

    this.message = message;
  }
}

export { ConflictError };
