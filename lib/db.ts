import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
});

export async function query<T>(
  sql: string,
  params: (string | number)[]
): Promise<T[]> {
  try {
    const [results] = await pool.execute(sql, params);
    return results as T[];
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

export default pool;
