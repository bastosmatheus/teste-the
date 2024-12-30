import { Pool } from "mysql2/promise";

interface DatabaseConnection {
  connect(): Pool;
}

export { DatabaseConnection };
