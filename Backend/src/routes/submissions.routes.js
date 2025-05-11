import express from "express"
import { authMiddleware } from "../middleware/auth.middleware.js"
import { getAllSubmission, getAllTheSubmissionsForProblem, getSubmissionsForProblem } from "../controllers/submission.controller.js"

const submissionsRoutes = express.Router()

submissionsRoutes.get('/get-all-submissions', authMiddleware, getAllSubmission)
submissionsRoutes.get('/get-submission/;problemId', authMiddleware, getSubmissionsForProblem)
submissionsRoutes.get('/get-submission-count/:problemId',authMiddleware, getAllTheSubmissionsForProblem)

export default submissionsRoutes