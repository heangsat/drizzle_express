import { mysqlTable,varchar,int,serial,text } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 })
})

export const userAuth = mysqlTable("user_auth", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 50 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: text("password").notNull(), // New column
})