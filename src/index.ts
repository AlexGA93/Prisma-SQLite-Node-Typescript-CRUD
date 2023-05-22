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
