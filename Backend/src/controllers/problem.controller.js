import { getJudge0LanguageId, submitBatch, pollBatchResults } from "../libs/judge0.libs"

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
            const token = submissionResult.map((res) => res.token)
            const results = await pollBatchResults(token)

            for (let i = 0; i<results.length; i++){
                const result = results[i]

                if(result.status.id !== 3){
                    return res.status(400).json({error: `Testcase ${i + 1} faild for language ${language}`})
                }
            }
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
                    userId:req.user.id,
                },
            })

        return res.status(201).json(newProblem)

        }
    } catch (error) {
        
    }

}