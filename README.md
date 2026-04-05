# drizzle_test

An Express API backed by MySQL and managed with Drizzle ORM. The project exposes basic user CRUD endpoints plus authentication endpoints for registration, login, and token-based sessions.

## Overview

This project contains two database-backed areas:

- `users`: a simple user table with create, read, update, and delete endpoints.
- `user_auth`: an authentication table with hashed passwords and JWT login support.

The app runs as a Node.js server, connects to a local MySQL database, and uses Drizzle migrations to manage schema changes.

## Tech Stack

- Node.js
- Express 5
- MySQL
- Drizzle ORM and Drizzle Kit
- bcryptjs for password hashing
- jsonwebtoken for login tokens
- cors for cross-origin requests

## Project Structure

```text
drizzle.config.js
package.json
src/
  main.js
  controller/
    middlecheck.js
  db/
    db.js
    schema.js
    migrations/
      0000_marvelous_victor_mancha.sql
      0001_rapid_the_call.sql
      meta/
        _journal.json
        0000_snapshot.json
        0001_snapshot.json
```

## Database Schema

### users

- `id`: auto-incrementing integer primary key
- `name`: varchar(255)
- `email`: varchar(255)

### user_auth

- `id`: serial primary key
- `name`: varchar(50), required
- `email`: varchar(255), required and unique
- `password`: text, required

## API Routes

### User CRUD

- `GET /getuser` - returns all rows from `users`
- `POST /addUser` - creates a new user after validation
- `PUT /updateUser/:id` - updates a user by id
- `DELETE /deleteUser/:id` - deletes a user by id

### Authentication

- `POST /register` - creates a new auth user, hashes the password with bcrypt, and prevents duplicate emails
- `POST /auth` - checks credentials against `user_auth` using a plain password comparison
- `GET /getUserAuth` - returns all rows from `user_auth`
- `POST /login` - validates credentials, compares bcrypt hashes, and returns a JWT token that expires in 1 hour

## Validation

The `POST /addUser` route uses middleware from `src/controller/middlecheck.js` to validate:

- `name` contains only letters and spaces
- `email` matches a basic email pattern
- both values are present and strings

## Setup

1. Install dependencies.

   ```bash
   npm install
   ```

2. Create a MySQL database named `drizzle_test` or update the credentials in:

   - `src/db/db.js`
   - `drizzle.config.js`

3. Apply the database schema.

   ```bash
   npm run db:push
   ```

   If you prefer generating migrations first, use:

   ```bash
   npm run db:generate
   ```

4. Start the server.

   ```bash
   npm run dev
   ```

The server listens on port `3000`.

## Scripts

- `npm run dev` - starts the server with nodemon
- `npm run db:generate` - generates Drizzle migration files
- `npm run db:push` - pushes the schema to the database

## Notes

- Database credentials are currently hardcoded in the source files.
- The JWT secret is also hardcoded in `src/main.js`.
- The project currently keeps the API simple and does not include a frontend.
