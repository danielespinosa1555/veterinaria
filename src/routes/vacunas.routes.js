import { Router } from 'express'
import { getVacunas, createVacuna } from '../controllers/vacunas.controller.js'

const router = Router()

router.get('/', getVacunas)
router.post('/', createVacuna)

export default router
