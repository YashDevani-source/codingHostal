import { use } from "react"
import { db } from "../libs/db.libs.js"

export const getAllSubmission = async (req, res) => {
    try {
        const userId = req.user.userId
        const submissions = await db.submission.findMany({
            where:{
                userId:userId
            }
        })

        return res.status(200).json({
            success: true,
            message: "Submission featched successfully",
            submissions
        })
    } catch (error) {
        console.error("Featch submissions Error", error)
        return res.status(500).json({
            success: false,
            error: "Failed to featch submissions"
        })
    }
}

export const getSubmissionsForProblem = async (req, res) => {
 try {
       const userId = req.user.Id
       const problemId = req.params.problemId
       const submissions = await db.submission.findMany({
           where:{
               userId:userId,
               problemId:problemId
           }
       })
       return res.status(200).json({
        success: true,
        message: "Submission featched successfully ",
        submissions
       })
 } catch (error) {
         console.error("Featch submissions Error", error)
        return res.status(500).json({
            success: false,
            error: "Failed to featch submissions"
        })
 }
}

export const getAllTheSubmissionsForProblem = async (req, res) => {
    try {
        const problemId = req.params.problemId
        const submissions = await db.submission.count({
            where:{
                problemId:problemId
            }
        })

        return res.status(200).json({
            success:true,
            message:"Submissions featched Successfully",
            count:submissions
        })
    } catch (error) {
        console.error("Featch submissions Error: ", error)
        return res.status(500).json({
            success:false,
            error: "Failed to featch submissions"
        })
    }
}