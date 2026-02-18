import express from 'express'
import cors from 'cors'

import duenosRoutes from './routes/duenos.routes.js'
import mascotasRoutes from './routes/mascotas.routes.js'
import citasRoutes from './routes/citas.routes.js'
import vacunasRoutes from './routes/vacunas.routes.js'
import mascotaVacunasRoutes from './routes/mascotaVacunas.routes.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Veterinaria funcionando 🚀'
  })
})

// 👇 REGISTRAR TODAS LAS TABLAS
app.use('/api/duenos', duenosRoutes)
app.use('/api/mascotas', mascotasRoutes)
app.use('/api/citas', citasRoutes)
app.use('/api/vacunas', vacunasRoutes)
app.use('/api/mascota-vacunas', mascotaVacunasRoutes)

export default app
