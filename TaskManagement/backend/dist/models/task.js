"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/tasks.ts
const express_1 = require("express");
const database_1 = __importDefault(require("../config/database"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Get all tasks for the authenticated user
router.get('/', authMiddleware_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield database_1.default.query('SELECT * FROM tasks WHERE "userId" = $1', [req.user.id]);
        res.json(result.rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
}));
// Create a new task
router.post('/', authMiddleware_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description } = req.body;
    try {
        const result = yield database_1.default.query('INSERT INTO tasks (title, description, "userId") VALUES ($1, $2, $3) RETURNING *', [title, description || null, req.user.id]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Task creation failed' });
    }
}));
// Update a task (mark complete, edit text)
router.put('/:id', authMiddleware_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, isComplete } = req.body;
    const taskId = req.params.id;
    try {
        const result = yield database_1.default.query('UPDATE tasks SET title = $1, description = $2, "isComplete" = $3 WHERE id = $4 AND "userId" = $5 RETURNING *', [title, description, isComplete, taskId, req.user.id]);
        if (result.rows.length === 0)
            return res.status(404).json({ error: 'Task not found' });
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Task update failed' });
    }
}));
// Delete a task
router.delete('/:id', authMiddleware_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taskId = req.params.id;
    try {
        const result = yield database_1.default.query('DELETE FROM tasks WHERE id = $1 AND "userId" = $2 RETURNING *', [taskId, req.user.id]);
        if (result.rows.length === 0)
            return res.status(404).json({ error: 'Task not found' });
        res.json({ message: 'Task deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Task deletion failed' });
    }
}));
exports.default = router;
//# sourceMappingURL=task.js.map