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
For a MySQL configuration we can create our database by MySQL Worckbench, creating a new user and a empty databse. The next step will be declare in our environment variables our database url:
```
DATABASE_URL="mysql://username:password@localhost:3306/database_name?database_name"
```

Our prisma configuration needs to declare mysql as provider: 
```
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
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

### Prisma Studio
With a simple tabular interface you can quickly have a look at the data of your local database and check if your app is working correctly.

Interact with your Data with full CRUD functionality.

View your data any way you want by filtering, sorting and paginating it.

More info in the [official site](https://www.prisma.io/studio).

### Node.js Server
We're going to create a simple Node.js and express script to initiate our server and connect the routes:

```
import express, { Express } from "express";
import { users, posts } from "./routes/index";
require("dotenv").config();

const app: Express = express();

app.use(express.json());

// Routes
app.use("/api/users", users);
app.use("/api/posts", posts);

const PORT: number | string = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server listening at port ${PORT}`));

```

### Routes
We will create a folder named 'routes' in out source project's file with avery endpoint calling at our controllers:

- /routes/users.routes.ts
```
import { Router } from "express";
import {
  deleteUser,
  getASingleUserControllers,
  getAllUsersControllers,
  insertAUser,
  updateUser,
} from "../controllers/users.controllers";
const router: Router = Router();

// routes
router.post("/new", insertAUser);
router.get("/all", getAllUsersControllers);
router.get("/:id", getASingleUserControllers);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;

```

- /routes/posts.routes.ts
```
import { Router } from "express";
import {
  getAllPosts,
  insertPost,
  getSinglePost,
  deletePost,
  updatePost,
} from "../controllers/posts.controllers";
const router: Router = Router();

// routes

router.post("/new", insertPost);
router.get("/all", getAllPosts);
router.get("/:id", getSinglePost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

export default router;

```

### Calling Prisma Client

When we execute every controller we need to call the prisma client. This operation will be executed every time that the process makes a call, so we will decare and export it in a separate folder called 'db':
- /db/db.ts
```
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
```

### Controllers
 
Every controller will declare and export an arrow function that we will call from our routes to execute our ORM order to the database:

- src\controllers\posts.controllers.ts
```
import { Request, Response } from "express";
import { prisma } from "../db/db";

export const getAllPosts = async (req: Request, res: Response) => {
  const allPosts = await prisma.post.findMany();
  res.json(allPosts);
};
export const getSinglePost = async (req: Request, res: Response) => {
  const singlePost = await prisma.post.findFirst({
    where: {
      id: parseInt(req.params.id),
    },
  });

  if (!singlePost) res.status(404).json({ error: "Post not found" });

  res.status(200).json(singlePost);
};

export const insertPost = async (req: Request, res: Response) => {
  const newPost = await prisma.post.create({
    data: req.body,
  });

  res.json(newPost);
};

export const updatePost = async (req: Request, res: Response) => {
  const updatedPost = await prisma.post.update({
    where: {
      id: parseInt(req.params.id),
    },
    data: req.body,
  });

  if (!updatedPost)
    res.status(404).json({ err: "Error registering a new Post" });

  res.json(updatedPost);
};

export const deletePost = async (req: Request, res: Response) => {
  const deletedPost = await prisma.post.delete({
    where: {
      id: parseInt(req.params.id),
    },
  });

  if (!deletedPost) res.status(404).json({ err: "Post not found in database" });

  res.status(200).json(deletedPost);
};

```
- src\controllers\users.controllers.ts
```
import { Request, Response } from "express";
import { prisma } from "../db/db";

export const getAllUsersControllers = async (req: Request, res: Response) => {
  const allUsers = await prisma.user.findMany();

  if (!allUsers)
    res.status(404).json({ err: "Users Notfound in the database!" });

  res.status(200).json(allUsers);
};

export const getASingleUserControllers = async (
  req: Request,
  res: Response
) => {
  const user = await prisma.user.findFirst({
    where: {
      id: parseInt(req.params.id),
    },
  });

  if (!user) res.status(404).json({ error: "User not found" });

  res.status(200).json(user);
};

export const insertAUser = async (req: Request, res: Response) => {
  const newUser = await prisma.user.create({
    data: req.body,
  });

  if (!newUser) res.status(404).json({ err: "Error registering a new User" });

  res.status(200).json(newUser);
};

export const updateUser = async (req: Request, res: Response) => {
  const updatedUser = await prisma.user.update({
    where: {
      id: parseInt(req.params.id),
    },
    data: req.body,
  });

  if (!updatedUser)
    res.status(404).json({ err: "Error registering a new User" });

  res.json(updatedUser);
};

export const deleteUser = async (req: Request, res: Response) => {
  const deletedUser = await prisma.user.delete({
    where: {
      id: parseInt(req.params.id),
    },
  });

  if (!deletedUser) res.status(404).json({ err: "User not found in database" });

  res.status(200).json(deletedUser);
};

```

### Execute
Since we've instaleld **Nodemon** in our project we only need to enter the following command in our terminal:
```
npm run dev
```