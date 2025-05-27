import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';

interface TestCase {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  description?: string;
}

const testCases: TestCase[] = [];

export const testCaseRoutes = Router();

testCaseRoutes.get('/', (_, res) => res.json(testCases));

testCaseRoutes.get('/:id', (req, res) => {
  const found = testCases.find(tc => tc.id === req.params.id);
  found ? res.json(found) : res.status(404).send('Not Found');
});

testCaseRoutes.post('/', (req, res) => {
  const newCase: TestCase = { id: uuidv4(), ...req.body };
  testCases.push(newCase);
  res.status(201).json(newCase);
});

testCaseRoutes.put('/:id', (req, res) => {
  const index = testCases.findIndex(tc => tc.id === req.params.id);
  if (index === -1) return res.status(404).send('Not Found');
  testCases[index] = { ...testCases[index], ...req.body };
  res.json(testCases[index]);
});

testCaseRoutes.delete('/:id', (req, res) => {
  const index = testCases.findIndex(tc => tc.id === req.params.id);
  if (index === -1) return res.status(404).send('Not Found');
  const deleted = testCases.splice(index, 1);
  res.json(deleted[0]);
});