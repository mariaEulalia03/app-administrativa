import { supabase } from '@/lib/supabase'
import type { User, Productor, Asociacion, Red, Feria } from '@/types'

// Helper para intentar consultar distintas variaciones de nombre de tabla de forma concurrente
async function safeQuery(tableNames: string[], selectQuery = '*') {
  // Ejecutamos las promesas en paralelo para no bloquear el flujo si hay múltiples fallos 404
  const promises = tableNames.map(async (tableName) => {
    if (selectQuery !== '*') {
      const { data, error } = await supabase.from(tableName).select(selectQuery)
      if (!error && data) return { data, tableName }
    }
    const { data, error } = await supabase.from(tableName).select('*')
    if (!error && data) return { data, tableName }
    throw error
  })

  try {
    // Retorna el primero que resuelva exitosamente
    return await Promise.any(promises)
  } catch (error: any) {
    console.error(`[Supabase Error] No se pudo consultar ninguna de las tablas [${tableNames.join(', ')}]`)
    return { data: [], tableName: tableNames[0] }
  }
}

export const supabaseService = {
  // ==========================================
  // PRODUCTORES
  // ==========================================
  async getProductores(): Promise<any[]> {
    const tableCandidates = ['Productor', 'productor', 'productores', 'Productores']
    
    // Primero intentamos con joins, si falla safeQuery usará select('*') automáticamente
    const { data } = await safeQuery(
      tableCandidates,
      `
        *,
        Direccion:IdDireccion (
          IdDireccion,
          Latitud,
          Longitud,
          Altitud,
          Calles,
          Referencia,
          BarrioComunidad:IdComunidad (
            Nombre,
            Parroquia:IdParroquia (
              Nombre,
              Canton:IdCanton (
                Nombre,
                Provincia:IdProvincia (Nombre)
              )
            )
          )
        ),
        Aval (
          IdAval,
          Nombre,
          Estado,
          Color,
          FechaCaducidad
        )
      `
    )

    return (data || []).map((p: any) => {
      const id = p.IdProductor || p.id_productor || p.id
      const nombres = p.Nombres || p.nombres || p.nombre || ''
      const apellidos = p.Apellidos || p.apellidos || ''
      const nombreCompleto = `${nombres} ${apellidos}`.trim() || `Productor #${id}`
      const dir = p.Direccion || p.direccion

      return {
        id,
        nombre: nombreCompleto,
        nombresCompletos: nombreCompleto,
        nombres,
        apellidos,
        cedula: p.Cedula || p.cedula || '',
        contacto: p.Contacto || p.contacto || '',
        email: p.Email || p.email || '',
        tipo: p.ActividadEconomica || p.actividad_economica || p.tipo || 'General',
        actividadEconomica: p.ActividadEconomica || p.actividad_economica || 'Agroproductor',
        provincia: dir?.BarrioComunidad?.Parroquia?.Canton?.Provincia?.Nombre || p.provincia || 'Azuay',
        parroquia: dir?.BarrioComunidad?.Parroquia?.Nombre || p.parroquia || 'Sin Parroquia',
        sector: dir?.BarrioComunidad?.Nombre || p.sector || 'Sin Sector',
        direccion: dir ? {
          id_direccion: dir.IdDireccion || dir.id_direccion,
          latitud: dir.Latitud !== undefined ? Number(dir.Latitud) : null,
          longitud: dir.Longitud !== undefined ? Number(dir.Longitud) : null,
          altitud: dir.Altitud !== undefined ? Number(dir.Altitud) : null,
          calles: dir.Calles || dir.calles || '',
          referencia: dir.Referencia || dir.referencia || '',
          provincia: dir.BarrioComunidad?.Parroquia?.Canton?.Provincia?.Nombre || 'Azuay',
          canton: dir.BarrioComunidad?.Parroquia?.Canton?.Nombre || '',
          parroquia: dir.BarrioComunidad?.Parroquia?.Nombre || '',
          barrio: dir.BarrioComunidad?.Nombre || ''
        } : undefined,
        ubicacion: {
          barrio: dir?.BarrioComunidad?.Nombre || p.sector || 'Sin Sector',
          parroquia: dir?.BarrioComunidad?.Parroquia?.Nombre || p.parroquia || 'Sin Parroquia',
          canton: dir?.BarrioComunidad?.Parroquia?.Canton?.Nombre || 'Desconocido',
          provincia: dir?.BarrioComunidad?.Parroquia?.Canton?.Provincia?.Nombre || p.provincia || 'Azuay',
          idDireccion: dir?.IdDireccion || dir?.id_direccion || p.IdDireccion,
          calles: dir?.Calles || dir?.calles || 'Sin calles',
          referencia: dir?.Referencia || dir?.referencia || ''
        },
        aval: p.Aval?.[0]
          ? {
              estado: p.Aval[0].Estado || p.Aval[0].estado,
              color: p.Aval[0].Color || p.Aval[0].color,
              descripcion: p.Aval[0].Nombre || p.Aval[0].nombre
            }
          : undefined
      }
    })
  },

  async getProductorById(id: string | number): Promise<any> {
    try {
      const all = await this.getProductores()
      const found = all.find((p: any) => String(p.id) === String(id))
      if (found) {
        return found
      }
    } catch (e) {
      console.warn('[Supabase] Error en getProductorById:', e)
    }
    return null
  },

  async saveProductor(productor: any): Promise<any> {
    const payload = {
      IdProductor: productor.id,
      Nombres: productor.nombres,
      Apellidos: productor.apellidos,
      Cedula: productor.cedula,
      Contacto: productor.contacto,
      Email: productor.email,
      ActividadEconomica: productor.actividadEconomica,
      IdDireccion: productor.idDireccion || productor.direccion?.idDireccion
    }

    const { data, error } = await supabase
      .from('Productor')
      .upsert(payload)
      .select()
      .single()

    if (error) {
      console.error('[Supabase] Error al guardar productor:', error.message)
      throw error
    }
    return data
  },

  // ==========================================
  // FERIAS AGROECOLÓGICAS
  // ==========================================
  async getFerias(): Promise<Feria[]> {
    const tableCandidates = [
      'FeriaAgroecologica',
      'feriaagroecologica',
      'feria_agroecologica',
      'Feria',
      'feria',
      'ferias'
    ]
    const { data } = await safeQuery(tableCandidates)

    const defaultImages = [
      'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&w=600&q=80'
    ]

    return (data || []).map((f: any, idx: number) => ({
      id: f.IdFeriaAgroecologica || f.id_feria_agroecologica || f.IdFeria || f.id_feria || f.id,
      nombre: f.Nombre || f.nombre || `Feria #${f.id}`,
      direccion: f.Direccion || f.direccion || f.Calles || 'Sector Central, Plaza Cívica',
      foto: f.foto || f.Foto || defaultImages[idx % defaultImages.length],
      frecuencia: f.Frecuencia || f.frecuencia || 'Semanal'
    }))
  },

  async getFeriaById(id: string | number): Promise<any> {
    const tableCandidates = [
      'FeriaAgroecologica',
      'feriaagroecologica',
      'feria_agroecologica',
      'Feria',
      'feria'
    ]
    let data: any = null

    for (const tableName of tableCandidates) {
      const { data: res } = await supabase
        .from(tableName)
        .select('*')
        .or(`IdFeriaAgroecologica.eq.${id},id_feria_agroecologica.eq.${id},IdFeria.eq.${id},id.eq.${id}`)
        .maybeSingle()
      if (res) {
        data = res
        break
      }
    }

    if (!data) return null

    return {
      id: data.IdFeriaAgroecologica || data.id_feria_agroecologica || data.IdFeria || data.id,
      nombre: data.Nombre || data.nombre,
      idDireccion: data.IdDireccion || data.id_direccion,
      calles: data.Calles || data.direccion || 'Ubicación Desconocida',
      redes: [],
      horarios: [],
      productos: []
    }
  },

  // ==========================================
  // ASOCIACIONES Y REDES
  // ==========================================
  async getAsociaciones(): Promise<Asociacion[]> {
    const tableCandidates = ['Asociacion', 'asociacion', 'asociaciones']
    const { data } = await safeQuery(tableCandidates)

    return (data || []).map((a: any) => ({
      id: a.IdAsociacion || a.id_asociacion || a.id,
      nombre: a.Nombre || a.nombre,
      numSocios: a.NumSocios || a.num_socios || a.numSocios || 0,
      icono: a.Icono || a.icono
    }))
  },

  async getRedes(): Promise<Red[]> {
    const tableCandidates = ['Red', 'red', 'redes']
    const { data } = await safeQuery(tableCandidates)

    return (data || []).map((r: any, idx: number) => ({
      id: r.IdRed || r.id_red || r.id,
      nombre: r.Nombre || r.nombre,
      cobertura: r.Cobertura || r.cobertura,
      icono: r.Icono || r.icono || 'mdi-hub'
    }))
  },

  // ==========================================
  // AVALES Y AGROECOSISTEMAS
  // ==========================================
  async getAvalByProductorId(idProductor: string | number): Promise<any> {
    const tableCandidates = ['Aval', 'aval', 'avales']
    for (const tableName of tableCandidates) {
      const { data } = await supabase
        .from(tableName)
        .select('*')
        .or(`id_productor.eq.${idProductor},IdProductor.eq.${idProductor}`)
        .maybeSingle()
      if (data) return data
    }
    return null
  },

  async saveAval(aval: any): Promise<any> {
    const payload = {
      IdAval: aval.id,
      id_productor: aval.productorId || aval.idProductor,
      IdEntidadControl: aval.idEntidadControl,
      Nombre: aval.nombre,
      Estado: aval.estado,
      FechaOtorga: aval.fechaOtorga,
      FechaFinaliza: aval.fechaFinaliza,
      FechaCaducidad: aval.fechaCaducidad || aval.fechaFinaliza
    }

    const { data, error } = await supabase
      .from('Aval')
      .upsert(payload)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getAgroecosistemaByProductor(idProductor: string | number): Promise<any> {
    const tableCandidates = ['Agroecosistema', 'agroecosistema', 'agroecosistemas']
    for (const tableName of tableCandidates) {
      const { data } = await supabase
        .from(tableName)
        .select('*')
        .or(`IdProductor.eq.${idProductor},id_productor.eq.${idProductor}`)
        .maybeSingle()
      if (data) return data
    }
    return null
  },

  async saveAgroecosistema(agro: any): Promise<any> {
    const { data, error } = await supabase
      .from('Agroecosistema')
      .upsert(agro)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // ==========================================
  // UBICACIÓN
  // ==========================================
  async getProvincias(): Promise<any[]> {
    const { data } = await safeQuery(['Provincia', 'provincia', 'provincias'])
    return data || []
  },

  async getCantones(idProvincia?: string | number): Promise<any[]> {
    const { data } = await safeQuery(['Canton', 'canton', 'cantones'])
    if (idProvincia && data) {
      return data.filter((c: any) => String(c.IdProvincia || c.id_provincia) === String(idProvincia))
    }
    return data || []
  },

  async getParroquias(idCanton?: string | number): Promise<any[]> {
    const { data } = await safeQuery(['Parroquia', 'parroquia', 'parroquias'])
    if (idCanton && data) {
      return data.filter((p: any) => String(p.IdCanton || p.id_canton) === String(idCanton))
    }
    return data || []
  },

  async getBarrios(idParroquia?: string | number): Promise<any[]> {
    const { data } = await safeQuery(['BarrioComunidad', 'barriocomunidad', 'barrio_comunidad', 'barrios'])
    if (idParroquia && data) {
      return data.filter((b: any) => String(b.IdParroquia || b.id_parroquia) === String(idParroquia))
    }
    return data || []
  },

  async saveDireccion(direccion: any): Promise<any> {
    const { data, error } = await supabase
      .from('Direccion')
      .upsert(direccion)
      .select()
      .single()

    if (error) throw error
    return data
  }
}
