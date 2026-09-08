import userData from '@/db/user.json'
import asociacionData from '@/db/asociacion.json'
import productorData from '@/db/productor.json'
import productorAsociacionData from '@/db/productor_asociacion.json'
import redData from '@/db/red.json'
import feriaData from '@/db/feriaagroecologica.json'
import provinciaData from '@/db/provincia.json'
import cantonData from '@/db/canton.json'
import parroquiaData from '@/db/parroquia.json'
import barrioData from '@/db/barriocomunidad.json'
import direccionData from '@/db/direccion.json'
import avalData from '@/db/aval.json'
import entidadControlData from '@/db/entidadcontrol.json'

import configuracionAvalData from '@/db/configuracion_aval.json'
import agroecosistemaData from '@/db/agroecosistema.json'

import type { User, Productor, Asociacion, Red, Feria } from '@/types'

export const dbService = {
  // Usuario
  async getUser(): Promise<User> {
    return { ...userData }
  },

  // Provincias
  async getProvincias(): Promise<string[]> {
    const list = provinciaData.map((p: any) => p.Nombre).filter(Boolean)
    return ['All', ...list]
  },

  // Productores
  async getProductores(): Promise<Productor[]> {
    return productorData.map((p: any, idx: number) => {
      const direccion = direccionData.find((d: any) => d.IdDireccion === p.IdDireccion)
      const barrio = barrioData.find((b: any) => b.IdBarrioComunidad === direccion?.IdComunidad)
      const parroquia = parroquiaData.find((pa: any) => pa.IdParroquia === barrio?.IdParroquia)
      const canton = cantonData.find((c: any) => c.IdCanton === parroquia?.IdCanton)
      const provincia = provinciaData.find((pr: any) => pr.IdProvincia === canton?.IdProvincia)

      // Assign one of the 3 aval configurations pseudo-randomly based on index
      const avalConfig = configuracionAvalData[idx % configuracionAvalData.length]

      return {
        id: p.IdProductor,
        nombre: `${p.Nombres || ''} ${p.Apellidos || ''}`.trim(),
        cedula: p.Cedula,
        contacto: p.Contacto,
        tipo: p.ActividadEconomica || 'General',
        provincia: provincia?.Nombre || 'Azuay',
        parroquia: parroquia?.Nombre || 'Sin Parroquia',
        sector: barrio?.Nombre || 'Sin Sector',
        aval: {
          estado: avalConfig.Estado,
          color: avalConfig.Color,
          descripcion: avalConfig.Descripcion
        }
      }
    })
  },

  async getProductorById(id: string): Promise<any> {
    const p: any = productorData.find((prod: any) => String(prod.IdProductor) === String(id))
    if (!p) return null

    const direccion: any = direccionData.find((d: any) => d.IdDireccion === p.IdDireccion)
    const barrio: any = barrioData.find((b: any) => b.IdBarrioComunidad === direccion?.IdComunidad)
    const parroquia: any = parroquiaData.find((pa: any) => pa.IdParroquia === barrio?.IdParroquia)
    const canton: any = cantonData.find((c: any) => c.IdCanton === parroquia?.IdCanton)
    const provincia: any = provinciaData.find((pr: any) => pr.IdProvincia === canton?.IdProvincia)
    
    // Fallback to random index for aval
    const avalConfig: any = configuracionAvalData[0]

    return {
      id: p.IdProductor,
      nombres: p.Nombres,
      apellidos: p.Apellidos,
      cedula: p.Cedula,
      contacto: p.Contacto,
      actividadEconomica: p.ActividadEconomica || 'Agroproductor',
      ubicacion: {
        barrio: barrio?.Nombre || 'Desconocido',
        parroquia: parroquia?.Nombre || 'Desconocido',
        canton: canton?.Nombre || 'Desconocido',
        provincia: provincia?.Nombre || 'Desconocido',
        idDireccion: p.IdDireccion,
        calles: direccion?.Calles || 'Sin calles',
        referencia: direccion?.Referencia || ''
      },
      aval: {
        estado: avalConfig.Estado,
        color: avalConfig.Color,
        descripcion: avalConfig.Descripcion
      }
    }
  },

  async getDireccionById(id: string | number): Promise<any> {
    const direccion: any = direccionData.find((d: any) => String(d.IdDireccion) === String(id))
    if (!direccion) return null

    const barrio: any = barrioData.find((b: any) => b.IdBarrioComunidad === direccion.IdComunidad)
    const parroquia: any = parroquiaData.find((pa: any) => pa.IdParroquia === barrio?.IdParroquia)
    const canton: any = cantonData.find((c: any) => c.IdCanton === parroquia?.IdCanton)
    const provincia: any = provinciaData.find((pr: any) => pr.IdProvincia === canton?.IdProvincia)

    return {
      idDireccion: direccion.IdDireccion,
      latitud: direccion.Latitud,
      longitud: direccion.Longitud,
      altitud: direccion.Altitud,
      calles: direccion.Calles,
      referencia: direccion.Referencia,
      barrio: barrio?.Nombre || '',
      parroquia: parroquia?.Nombre || '',
      canton: canton?.Nombre || '',
      provincia: provincia?.Nombre || ''
    }
  },

  async getAgroecosistemaByProductor(idProductor: string): Promise<any> {
    const a: any = agroecosistemaData.find((agro: any) => String(agro.IdProductor) === String(idProductor))
    if (!a) return null

    // Fetch direccion coordinates if any
    const direccion: any = direccionData.find((d: any) => d.IdDireccion === a.IdDireccion)

    return {
      idAgroecosistema: a.IdAgroecosistema,
      idProductor: a.IdProductor,
      idDireccion: a.IdDireccion,
      area: a.M2, // Use M2 from Excel directly
      tipoArea: a.IdTipoArea,
      productos: Array.isArray(a.productos_nombres) ? a.productos_nombres : [],
      direccion: {
        latitud: direccion?.Latitud || null,
        longitud: direccion?.Longitud || null,
        altitud: direccion?.Altitud || null,
        referencia: direccion?.Referencia || '',
        calles: direccion?.Calles || ''
      }
    }
  },

  async getAvalByProductor(idProductor: string | number): Promise<any> {
    const a: any = avalData.find((av: any) => String(av.id_productor) === String(idProductor))
    if (!a) return null

    const formatExcelDate = (serial: any) => {
      if (!serial) return ''
      if (typeof serial === 'string' && serial.includes('-')) return serial
      const date = new Date((Number(serial) - 25569) * 86400 * 1000)
      return !isNaN(date.getTime()) ? date.toISOString().split('T')[0] : String(serial)
    }

    const entidad = entidadControlData.find((e: any) => e.IdEntidadControl === a.IdEntidadControl)
    const productor = productorData.find((p: any) => String(p.IdProductor) === String(a.id_productor))

    return {
      id: a.IdAval,
      idEntidadControl: entidad?.Nombre || a.IdEntidadControl || 'EDEC',
      nombre: a.Nombre,
      estado: a.Estado,
      fechaOtorga: formatExcelDate(a.FechaOtorga),
      fechaFinaliza: formatExcelDate(a.FechaFinaliza),
      idProductor: productor ? `${productor.Nombres || ''} ${productor.Apellidos || ''}`.trim() : `Productor #${a.id_productor}`
    }
  },

  // Asociaciones
  async getAsociaciones(): Promise<Asociacion[]> {
    return asociacionData.map((a: any) => {
      // Calculate numSocios by filtering productorAsociacionData
      const sociosCount = productorAsociacionData.filter(
        (pa: any) => pa.IdAsociacion === a.IdAsociacion
      ).length

      return {
        id: a.IdAsociacion,
        nombre: a.Nombre,
        numSocios: sociosCount
      }
    })
  },

  // Redes
  async getRedes(): Promise<Red[]> {
    const icons = ['mdi-hub', 'mdi-share-variant', 'mdi-sitemap', 'mdi-vector-polyline']
    return redData.map((r: any, idx: number) => ({
      id: r.IdRed,
      nombre: r.Nombre,
      icono: icons[idx % icons.length]
    }))
  },

  // Ferias
  async getFerias(): Promise<Feria[]> {
    const defaultImages = [
      'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&w=600&q=80'
    ]

    return feriaData.map((f: any, idx: number) => ({
      id: f.IdFeriaAgroecologica,
      nombre: f.Nombre,
      foto: defaultImages[idx % defaultImages.length],
      direccion: 'Sector Central, Plaza Cívica'
    }))
  }
}

