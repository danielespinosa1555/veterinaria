import { supabase } from '../config/supabase.js'

export const getMascotaVacunas = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('mascota_vacunas')
      .select('*, mascotas(*), vacunas(*)')

    if (error) throw error

    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const createMascotaVacuna = async (req, res) => {
  try {
    const { id_mascota, id_vacuna, fecha_aplicacion, proxima_dosis } = req.body

    const { data, error } = await supabase
      .from('mascota_vacunas')
      .insert([{ id_mascota, id_vacuna, fecha_aplicacion, proxima_dosis }])
      .select()

    if (error) throw error

    res.status(201).json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
