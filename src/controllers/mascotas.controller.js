import { supabase } from '../config/supabase.js'

export const getMascotas = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('mascotas')
      .select('*, duenos(*)')

    if (error) throw error

    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const createMascota = async (req, res) => {
  try {
    const { nombre, especie, id_dueno } = req.body

    const { data, error } = await supabase
      .from('mascotas')
      .insert([{ nombre, especie, id_dueno }])
      .select()

    if (error) throw error

    res.status(201).json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const deleteMascota = async (req, res) => {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from('mascotas')
      .delete()
      .eq('id', id)

    if (error) throw error

    res.json({ success: true, message: 'Mascota eliminada' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
