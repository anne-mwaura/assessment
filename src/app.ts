import express from 'express';
import productRoutes from './Routes/ProductRoutes'
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/api', productRoutes);

export default app;
