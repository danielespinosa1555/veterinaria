import { supabase } from '../config/supabase.js'

export const getCitas = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('citas')
      .select('*, mascotas(*)')

    if (error) throw error

    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const createCita = async (req, res) => {
  try {
    const { id_mascota, fecha_cita, motivo, estado } = req.body

    const { data, error } = await supabase
      .from('citas')
      .insert([{ id_mascota, fecha_cita, motivo, estado }])
      .select()

    if (error) throw error

    res.status(201).json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
