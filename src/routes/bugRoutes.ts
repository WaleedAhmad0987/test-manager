import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';

interface Bug {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'resolved';
  relatedTestCaseId?: string;
}

const bugs: Bug[] = [];

export const bugRoutes = Router();

bugRoutes.get('/', (_, res) => res.json(bugs));

bugRoutes.get('/:id', (req, res) => {
  const bug = bugs.find(b => b.id === req.params.id);
  bug ? res.json(bug) : res.status(404).send('Not Found');
});

bugRoutes.post('/', (req, res) => {
  const newBug: Bug = { id: uuidv4(), ...req.body };
  bugs.push(newBug);
  res.status(201).json(newBug);
});

bugRoutes.put('/:id', (req, res) => {
  const index = bugs.findIndex(b => b.id === req.params.id);
  if (index === -1) return res.status(404).send('Not Found');
  bugs[index] = { ...bugs[index], ...req.body };
  res.json(bugs[index]);
});

bugRoutes.delete('/:id', (req, res) => {
  const index = bugs.findIndex(b => b.id === req.params.id);
  if (index === -1) return res.status(404).send('Not Found');
  const deleted = bugs.splice(index, 1);
  res.json(deleted[0]);
});