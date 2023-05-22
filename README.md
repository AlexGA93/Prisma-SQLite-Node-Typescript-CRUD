# CRUD APP - SQLite, Prisma, Node.js, Express.js, Typescript

## Steps

### Init our project
```
npm init -y
```
### Install typescript and node types
```
npm install typescript ts-node @types/node --save-dev
```
### Initialize TypeScript
```
npx tsc --init
```
### Install the Prisma CLI as a development dependency in the project
```
npm install prisma --save-dev
```
### Set up Prisma with the init command of the Prisma CLI
- **NOTE:** If you want to use another supported database we can modify the configuration. To do this we've to read the official documentation for our desired database for example [MySQL](https://www.prisma.io/stack).
```
npx prisma init --datasource-provider sqlite
```
### Model your data in the Prisma schema
The Prisma schema provides an intuitive way to model data. Add the following models to your schema.prisma file:

```
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

////////////////////////////////////

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String?
  published Boolean @default(false)
  author    User    @relation(fields: [authorId], references: [id])
  authorId  Int
}

```

### Migratrion to create Database
At this point, you have a Prisma schema but no database yet. Run the following command in your terminal to create the SQLite database and the User and Post tables represented by your models:

```
npx prisma migrate dev --name init
```
This command did two things:

- It creates a new SQL migration file for this migration in the prisma/migrations directory.
- It runs the SQL migration file against the database.

Because the SQLite database file didn't exist before, the command also created it inside the prisma directory with the name dev.db as defined via the environment variable in the .env file.

### Node.js Server
We're going to create a simple Node.js and express script to initiate our server and connect the routes:

```
import express, { Express }  from 'express';
require('dotenv').config();

const app: Express = express();

app.use(express.json());

// Routes

const PORT: number | string = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server listening at port ${PORT}`));
```