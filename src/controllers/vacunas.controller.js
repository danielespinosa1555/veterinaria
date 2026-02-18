import { supabase } from '../config/supabase.js'

export const getVacunas = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('vacunas')
      .select('*')

    if (error) throw error

    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const createVacuna = async (req, res) => {
  try {
    const { nombre_vacuna, descripcion } = req.body

    const { data, error } = await supabase
      .from('vacunas')
      .insert([{ nombre_vacuna, descripcion }])
      .select()

    if (error) throw error

    res.status(201).json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
