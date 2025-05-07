import express from 'express'
import { createProblem } from '../controllers/problem.controller.js'
import { authMiddleware, checkAdmin } from '../middleware/auth.middleware.js'


const problemsRouter = express.Router()

problemsRouter.post('/create-problem',authMiddleware, checkAdmin, createProblem)
// problemsRouter.get('get-all-problems')
// problemsRouter.get('get-solved-problem')
// problemsRouter.get('/get-problem/:id')
// problemsRouter.patch('update-problem/:id')
// problemsRouter.delete('/delete-problem/:id')

export default problemsRouter