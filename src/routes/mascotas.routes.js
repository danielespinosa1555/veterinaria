import { Router } from 'express'
import { getMascotas, createMascota, deleteMascota } from '../controllers/mascotas.controller.js'

const router = Router()

router.get('/', getMascotas)
router.post('/', createMascota)
router.delete('/:id', deleteMascota)

export default router
