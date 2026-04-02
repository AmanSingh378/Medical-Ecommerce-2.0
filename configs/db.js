import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

const connectionString = process.env.DATABASE_URL;

const pool = new pg.Pool({
  connectionString,
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10
});

export const db = drizzle(pool);

