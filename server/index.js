import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

const envPath = new URL('../.env', import.meta.url);
dotenv.config({ path: envPath.pathname });

const app = express();
const PORT = process.env.PORT || 5000;

const { default: apiRoutes } = await import('./routes/index.js');

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

app.use('/api', apiRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Eco scrap server running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
