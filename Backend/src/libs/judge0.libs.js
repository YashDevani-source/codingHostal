export const getJudge0LanguageId = (Language) => {
    const languageMap = {
        "PYTHON":71,
        "JAVA":62,
        "JAVASCRIPT":63,
    }

    return languageMap[Language.toUpperCase()]
}