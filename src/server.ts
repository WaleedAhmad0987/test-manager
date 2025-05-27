import express from 'express';
import bodyParser from 'body-parser';
import { testCaseRoutes } from './routes/testCaseRoutes';
import { bugRoutes } from './routes/bugRoutes';

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Root endpoint
app.get('/', (req, res) => {
  res.send('OK');
});

app.use('/api/testcases', testCaseRoutes);
app.use('/api/bugs', bugRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

export default app;