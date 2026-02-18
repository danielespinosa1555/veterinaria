import { Router } from 'express'
import { getDuenos, createDueno } from '../controllers/duenos.controller.js'

const router = Router()

router.get('/', getDuenos)
router.post('/', createDueno)

export default router
