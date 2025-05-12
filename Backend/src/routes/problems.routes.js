import express from 'express'
import { createProblem, getAllProblems, getProblemById, UpdatePorblem, deleteProblemById, getAllProblemSolvedByUser } from '../controllers/problem.controller.js'
import { authMiddleware, checkAdmin } from '../middleware/auth.middleware.js'


const problemsRouter = express.Router()

problemsRouter.post('/create-problem',authMiddleware, checkAdmin, createProblem)
problemsRouter.get('/get-all-problems', authMiddleware, checkAdmin, getAllProblems)
problemsRouter.get('/get-solved-problem', authMiddleware, getAllProblemSolvedByUser)
problemsRouter.get('/get-problem/:id', authMiddleware, getProblemById)
problemsRouter.patch('/update-problem/:id',authMiddleware, checkAdmin,  UpdatePorblem)
problemsRouter.delete('/delete-problem/:id', authMiddleware, checkAdmin, deleteProblemById)

export default problemsRouter