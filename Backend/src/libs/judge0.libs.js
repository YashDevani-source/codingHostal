import axios from 'axios'

export const getJudge0LanguageId = (Language) => {
    const languageMap = {
        "PYTHON":71,
        "JAVA":62,
        "JAVASCRIPT":63,
    }

    return languageMap[Language.toUpperCase()]
}

export const submitBatch = async (submissions) => {
    const {data} = await axios.post(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,{
        submissions,
    })

    console.log("Submissions",data)

    return data // tokens in array [{token}, {token}, {token}]
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve,ms))


export const pollBatchResults = async (tokens) => {
    console.log('Entering pollBatchResults');
    while(true){
        const {data} = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`,{
            params:{
                tokens:tokens.join(","),
                base64_encoded:false,
            }
        })
        console.log("Data",data);
        
        const results = data.submissions

        const isAllDone = results.every(
            (r) => r.status.id !== 1 && r.status.id !== 2
        )

        if(isAllDone) return results
        await sleep(1000)
    }
}


export const getLanguageName = (Language_id) => {
    const Language_Name = {
        74: "TypeScript",
        71: "Python",
        62: "Java",
        63: "JavaScript"
    }

    return Language_Name[Language_id] || "Unknown"
}