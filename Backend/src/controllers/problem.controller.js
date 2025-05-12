import { getJudge0LanguageId, submitBatch, pollBatchResults } from "../libs/judge0.libs.js"
import { db } from "../libs/db.libs.js"
export const createProblem = async (req, res) => {
    // get all the data from req.body
    const {title, description, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolutions} = req.body
    // check ADMIN
    if(!req.user.role === 'ADMIN'){
        return res.status(403).json({
            success: false,
            error: 'You are not allowed to create a problem'
        })
    }
    // loop through each refrance solution for different languages
    try {
        for(const [language, solutionCode] of Object.entries(referenceSolutions)){
            const languageId = getJudge0LanguageId(language)

            console.log(languageId);
            

            if(!language){
                return res.status(400).json({error: `Language ${language} is not supported`})
            }

            const submissions = testcases.map(({input, output}) => ({
                source_code:solutionCode,
                language_id:languageId,
                stdin:input,
                expected_output:output,

            }))


            const submissionResult = await submitBatch(submissions)
            console.log("submissionResult",submissionResult);
            
            const token = submissionResult.map((res) => res.token)
            console.log("token",token);
            
            const results = await pollBatchResults(token)

            console.log("Polled results",results);
            

            for (let i = 0; i<results.length; i++){
                const result = results[i]

                if(result.status.id !== 3){
                    return res.status(400).json({error: `Testcase ${i + 1} faild for language ${language}`})
                }
            }
        }

        console.log("Problem saving started");
        
            // save the problen to the database

            const newProblem = await db.problem.create({
                data:{
                    title,
                    description,
                    difficulty,
                    tags,
                    examples,
                    constraints,
                    testcases,
                    codeSnippets,
                    referenceSolutions,
                    user:{
                        connect:{
                            id: req.user.id
                        }
                    }
                },
            })

            console.log("Problem saved");

        return res.status(201).json({
            success: true,
            message: 'Problem created successfully',
            data: newProblem
        })

    } catch (error) {
        console.log("error creating problem",error);
        return res.status(500).json({
            success: false,
            error,
            message: 'Error creating problem'
        })
    }

}

export const getAllProblems = async (req, res) => {
    try {
        const problems = await db.problem.findMany()

        if(!problems){
            return res.status(404).json({
                success: false,
                error: "No problem found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Message Fetched Successfully",
            problems,
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: "Error While featching Problems"
        })
    }
}

export const getProblemById = async (req, res) => {
    const {id} = req.params

    try {
        const problem = await db.problem.findUnique({
            where:{
                id,
            }
        })


        if(!problem){
            return res.status(404).json({
                success: false,
                message: "Problem not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Message Created Successfully",
            problem
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: "Error While Fetching Problem by id"
        })
    }
}

export const UpdatePorblem = async (req,res) => {
     const {id} = req.params

    try {
        
        const problem = await db.problem.findUnique({
            where:{
                id
            }
        })

        if(!problem){
            return res.status(400).json({
                success:false,
                message: 'problem not found to Update'
            })
        }

        const {title, description, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolutions} = req.body

        if(!req.user.role === 'ADMIN'){
            return res.status(403).json({
                success: false,
                error: 'You are not allowed to create a problem'
            })
        }

        for(const [language, solutionCode] of Object.entries(referenceSolutions)){
            const languageId = getJudge0LanguageId(language)

            console.log(languageId);
            

            if(!language){
                return res.status(400).json({error: `Language ${language} is not supported`})
            }

            const submissions = testcases.map(({input, output}) => ({
                source_code:solutionCode,
                language_id:languageId,
                stdin:input,
                expected_output:output,

            }))


            const submissionResult = await submitBatch(submissions)
            console.log("submissionResult",submissionResult);
            
            const token = submissionResult.map((res) => res.token)
            console.log("token",token);
            
            const results = await pollBatchResults(token)

            console.log("Polled results",results);
            

            for (let i = 0; i<results.length; i++){
                const result = results[i]

                if(result.status.id !== 3){
                    return res.status(400).json({error: `Testcase ${i + 1} faild for language ${language}`})
                }
            }
        }

        console.log("Updated Problem started");
        


        const updateProblem = await db.problem.update({
            where:{
                id
            },
            data:{
                title,
                description,
                difficulty,
                tags,
                examples,
                constraints,
                testcases,
                codeSnippets,
                referenceSolutions,
                user:{
                    connect:{
                        id: req.user.id
                    }
                }
            }
        })
        console.log("Problem Updated Successfully"); 

        return res.status(200).json({
            success: true,
            message: 'Problem Updated Successfully',
            data: updateProblem
        })



    } catch (error) {

        console.log(error)
        return res.status(500).json({
            success: false,
            error: "Error While Updating Problem"
        })

    }
}

export const deleteProblemById = async (req, res) => {
    const {id} = req.params

    try {
        const problem = await db.problem.findUnique({
            where:{
                id
            }
        })

        if(!problem){
            res.status(404).json({
                success: false,
                message: "Problem not found",
            })
        }

        await db.problem.delete({
            where:{
                id
            }
        })

        return res.status(200).json({
            success: true,
            message: "Problem Deleted Successfully"
        })


    } catch (error) {
        return res.status(500).json({
            success:false,
            error,
            message: "Error While Deleting Problem"
        })
    }
}

export const getAllProblemSolvedByUser = async (req, res) => {
  try {
    const problems = await db.problem.findMany({
      where:{
        solvedBy:{
          some:{
            userId:req.user.id
          }
        }
      },
      include:{
        solvedBy:{
          where:{
            userId:req.user.id
          }
        }
      }
    })

    res.status(200).json({
      success:true,
      message:"Problems fetched successfully",
      problems
    })
  } catch (error) {
    console.error("Error fetching problems :" , error);
    res.status(500).json({error:"Failed to fetch problems"})
  }
}
