export const BASE_URL = 'https://script.google.com/macros/s/AKfycbwJ-Ms9QPBTgXfm1tdHrMay6QYNJJoCid6E63iwddpNDgGdxq_mUJG7cFyF1FTWVJr0fw/exec'

/**
 * Obtiene la lista de alimentos desde Google Sheets
 */
export const getAlimentos = async () => {
  try {
    const response = await fetch(`${BASE_URL}?type=alimentos`)
    const result = await response.json()
    if (result.status === 'success') {
      return result.data
    }
    console.error('Error al obtener alimentos:', result.message)
    return []
  } catch (error) {
    console.error('Error de red al consultar alimentos:', error)
    return []
  }
}

/**
 * Obtiene la lista de plantas medicinales desde Google Sheets
 */
export const getPlantas = async () => {
  try {
    const response = await fetch(`${BASE_URL}?type=plantas`)
    const result = await response.json()
    if (result.status === 'success') {
      return result.data
    }
    console.error('Error al obtener plantas:', result.message)
    return []
  } catch (error) {
    console.error('Error de red al consultar plantas:', error)
    return []
  }
}
