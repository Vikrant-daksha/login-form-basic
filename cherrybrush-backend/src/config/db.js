import { Pool } from "pg"
import env from "dotenv"

env.config();

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Primary for Production (Render, Neon, etc.)
    user: process.env.DATABASE_URL ? undefined : process.env.PG_USER,
    host: process.env.DATABASE_URL ? undefined : process.env.PG_HOST,
    database: process.env.DATABASE_URL ? undefined : process.env.PG_DATABASE,
    password: process.env.DATABASE_URL ? undefined : process.env.PG_PASSWORD,
    port: process.env.DATABASE_URL ? undefined : Number(process.env.PG_PORT),
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

pool.connect()
    .then(() => console.log('Postgres Connected'))
    .catch(err => console.error('Postgres Connection Error', err));

pool.on('error', (err) => {
    console.error('Unexpected error', err);
    process.exit(-1);
});

export const query = (text, params) => pool.query(text, params);