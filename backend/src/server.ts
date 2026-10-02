import express, { Request, Response } from 'express';

import cors from 'cors';


import paymentRoutes from './routes/paymentRoutes';

const app = express();

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());    

app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'online', 
    timestamp: new Date().toISOString() 
  });
});

app.use('/api/snailpay', paymentRoutes);

app.listen(PORT, () => {
  console.log(` Online. http://localhost:${PORT}`);
});
