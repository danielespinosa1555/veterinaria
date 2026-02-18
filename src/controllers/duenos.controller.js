import { supabase } from '../config/supabase.js'

export const getDuenos = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('duenos')
      .select('*')

    if (error) throw error

    res.json({
      success: true,
      data
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const createDueno = async (req, res) => {
  try {
    const { nombre, telefono, email } = req.body

    const { data, error } = await supabase
      .from('duenos')
      .insert([{ nombre, telefono, email }])
      .select()

    if (error) throw error

    res.status(201).json({
      success: true,
      data
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
