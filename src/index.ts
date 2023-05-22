import express, { Express }  from 'express';
require('dotenv').config();

const app: Express = express();

app.use(express.json());

// Routes

const PORT: number | string = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server listening at port ${PORT}`));