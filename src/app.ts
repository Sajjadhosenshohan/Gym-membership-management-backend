import express, { Application, Request, Response } from 'express';
import notFound from './app/middlewares/notFound';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './app/routes';
import { globalErrorHandler } from './app/error/globalErrorHandler';
const app: Application = express();

const corseOptions = {
  origin: [
    '*'
  ],
  credentials: true,
};

app.use(cors(corseOptions));

// parser
app.use(cookieParser());
app.use(express.json());

// application routes
app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.send({
    status: true,
    message: 'Gym Management System API is Running..!',
  });
});

// for global error
app.use(globalErrorHandler);

// for not found route
app.use(notFound);

export default app;
