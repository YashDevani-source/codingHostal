import { getJudge0LanguageId, submitBatch } from "../libs/judge0.libs"

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



        }
    } catch (error) {
        
    }
    // Save problem in db
}