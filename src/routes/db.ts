import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

class Database {
  private static instance: Database;
  private pool: Pool;

  private constructor() {
    this.pool = new Pool({
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: Number(process.env.PGPORT) || 3000,
    });
  }

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async query(text: string, params?: any[]) {
    return await this.pool.query(text, params);
  }
}

export default Database.getInstance();
