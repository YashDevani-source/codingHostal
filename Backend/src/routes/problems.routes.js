import express from 'express'

const router = express.Router()

router.post('/create-problem')
router.get('get-all-problems')
router.get('get-solved-problem')
router.get('/get-problem/:id')
router.patch('update-problem/:id')
router.delete('/delete-problem/:id')

export default router