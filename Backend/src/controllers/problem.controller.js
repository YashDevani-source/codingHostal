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