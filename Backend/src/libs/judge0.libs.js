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
    const {data} = await axios.post(`${Process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=true`,{
        submissions
    })

    console.log("Submissions",data)

    return data
}
