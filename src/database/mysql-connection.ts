import mysql, { PoolOptions } from "mysql2/promise";
import { configDotenv } from "dotenv";
import { DatabaseConnection } from "./database-connection";

configDotenv();

class MysqlConnection implements DatabaseConnection {
  private readonly database: PoolOptions;

  constructor() {
    this.database = {
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      database: process.env.MYSQL_DATABASE,
      password: process.env.MYSQL_PASSWORD,
    };
  }

  public connect() {
    const pool = mysql.createPool(this.database);

    return pool;
  }
}

export { MysqlConnection };
