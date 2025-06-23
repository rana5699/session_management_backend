import express, { Application } from 'express';
import cors from 'cors';
import routers from './routes';
import globalErrorHandler from './middlewares/globalErrorHandler';
import notFoundHandler from './middlewares/notFoundHandler';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// Full API Endpoint
app.use('/api/v1', routers);

app.get('/', (req, res) => {
  res.send('Welcome to the Session Management API');
});

// global error handler
app.use(globalErrorHandler);

// not found handler
app.use(notFoundHandler);

export default app;
