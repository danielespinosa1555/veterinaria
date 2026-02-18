import { Router } from 'express'
import { getMascotaVacunas, createMascotaVacuna } from '../controllers/mascotaVacunas.controller.js'

const router = Router()

router.get('/', getMascotaVacunas)
router.post('/', createMascotaVacuna)

export default router
