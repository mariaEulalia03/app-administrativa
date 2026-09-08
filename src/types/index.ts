export interface User {
  id: number | string
  nombre: string
  email: string
  avatar: string
  rol: string
}

export interface Productor {
  id: number | string
  nombre: string
  cedula?: string | number
  contacto?: string | number
  provincia?: string
  parroquia?: string
  sector?: string
  tipo?: string
  aval?: {
    estado: string
    color: string
    descripcion?: string
  }
}

export interface Asociacion {
  id: number | string
  nombre: string
  numSocios?: number
  icono?: string
}

export interface Red {
  id: number | string
  nombre: string
  icono?: string
  cobertura?: string
}

export interface Feria {
  id: number | string
  nombre: string
  foto?: string
  direccion?: string
  parroquia?: string
  provincia?: string
  frecuencia?: string
}

