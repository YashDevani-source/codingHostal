import express from 'express'
import { createProblem, getAllProblems } from '../controllers/problem.controller.js'
import { authMiddleware, checkAdmin } from '../middleware/auth.middleware.js'


const problemsRouter = express.Router()

problemsRouter.post('/create-problem',authMiddleware, checkAdmin, createProblem)
problemsRouter.get('get-all-problems', authMiddleware, checkAdmin, getAllProblems)
problemsRouter.get('get-solved-problem', authMiddleware)
problemsRouter.get('/get-problem/:id', authMiddleware)
problemsRouter.patch('update-problem/:id', authMiddleware, checkAdmin)
problemsRouter.delete('/delete-problem/:id', authMiddleware, checkAdmin)

export default problemsRouter