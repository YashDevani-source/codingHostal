import { pollBatchResults, submitBatch } from "../libs/judge0.libs.js"

export const executeCode = async (req, res) => {
    try {
        const {source_code, language_id, stdin, expected_output, problemId} = req.body

        // 1. validate test cases

        if(
            !Array.isArray(stdin) ||
            stdin.length === 0 ||
            !Array.isArray(expected_output) ||
            expected_output.length !== stdin.length
        ){
            return res.status(400).json({
                success: false,
                error: "Invalid or Missing test cases"
            })
        }

        // 2. Prepare each test case for judge0 batch submission
        const submissions = stdin.map((input) => ({
            source_code,
            language_id,
            stdin: input
        }))

        // 3. Send batch of submission to judge0
        const submitResponse = await submitBatch(submissions)

        const tokens = submitResponse.map((res) => res.token)

        // 4. poll judge0 for results of all submitted test cases
        const results = await pollBatchResults(tokens)
        console.log("resukts----------------------------")
        console.log(results)
    } catch (error) {
        
    }
}