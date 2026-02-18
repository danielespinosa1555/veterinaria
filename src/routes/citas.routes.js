import { Router } from 'express'
import { getCitas, createCita } from '../controllers/citas.controller.js'

const router = Router()

router.get('/', getCitas)
router.post('/', createCita)

export default router
