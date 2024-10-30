import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Define a type for SQL parameter values
type SqlParameter = string | number | boolean | null | Buffer | Date;

export async function query<T>(
  sql: string,
  values: SqlParameter[]
): Promise<T[]> {
  try {
    // Test the connection before executing the query
    await pool.getConnection();
    const [rows] = await pool.execute(sql, values);
    return rows as T[];
  } catch (error) {
    console.error("Database query error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Unknown database error"
    );
  }
}

// Add a function to test database connection
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    connection.release();
    return true;
  } catch (error) {
    console.error("Database connection test failed:", error);
    return false;
  }
}

export default pool;
