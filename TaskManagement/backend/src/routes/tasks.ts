// backend/src/routes/tasks.ts
import { Router } from 'express';
import pool from '../config/database';
import { authenticateJWT, AuthRequest } from '../middleware/authMiddleware';

const router = Router();

// Get all tasks for the authenticated user
router.get('/', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks WHERE "userId" = $1', [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Create a new task
router.post('/', authenticateJWT, async (req: AuthRequest, res) => {
  const { title, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO tasks (title, description, "userId") VALUES ($1, $2, $3) RETURNING *',
      [title, description || null, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Task creation failed' });
  }
});

// Update a task (mark complete, edit text)
router.put('/:id', authenticateJWT, async (req: AuthRequest, res) => {
  const { title, description, isComplete } = req.body;
  const taskId = req.params.id;
  try {
    const result = await pool.query(
      'UPDATE tasks SET title = $1, description = $2, "isComplete" = $3 WHERE id = $4 AND "userId" = $5 RETURNING *',
      [title, description, isComplete, taskId, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Task not found' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Task update failed' });
  }
});

// Delete a task
router.delete('/:id', authenticateJWT, async (req: AuthRequest, res) => {
  const taskId = req.params.id;
  try {
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND "userId" = $2 RETURNING *',
      [taskId, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Task deletion failed' });
  }
});

export default router;
