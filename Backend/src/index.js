import express from 'express';
import dotenv from 'dotenv'

dotenv.config('.env')

const app = express()

app.get('/', (req, res) => {
    res.send('Hello Coders wecome to our 2nd Home LeetLab')
})

app.use('/api/v1/auth', authRoutes)

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})