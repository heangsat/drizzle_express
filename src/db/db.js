import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";


const poolConnection = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  database: "drizzle_test",
  password: "Zeo@1523"
});

export const db = drizzle({ client: poolConnection });
