import { supabaseService } from './supabase.service'
import { dbService as backupService } from './db.service.backup'
import type { User, Productor, Asociacion, Red, Feria } from '@/types'

export const dbService = {
  // ==========================================
  // USUARIO
  // ==========================================
  async getUser(): Promise<User> {
    return await backupService.getUser()
  },

  // ==========================================
  // PROVINCIAS
  // ==========================================
  // Provincias
  async getProvincias(): Promise<string[]> {
    try {
      const supa = await supabaseService.getProvincias()
      if (supa && supa.length > 0) {
        const list = supa.map((p: any) => p.Nombre || p.nombre).filter(Boolean)
        return ['All', ...list]
      }
    } catch (e) {
      console.warn('[dbService] Error con Supabase en getProvincias:', e)
    }
    return await backupService.getProvincias()
  },

  async getProvinciasList(): Promise<any[]> {
    try {
      const supa = await supabaseService.getProvincias()
      if (supa && supa.length > 0) return supa
    } catch (e) {
      console.warn('[dbService] Error con Supabase en getProvinciasList:', e)
    }
    return await backupService.getProvinciasList()
  },

  async getCantonesList(idProvincia?: string | number): Promise<any[]> {
    try {
      const supa = await supabaseService.getCantones(idProvincia)
      if (supa && supa.length > 0) return supa
    } catch (e) {
      console.warn('[dbService] Error con Supabase en getCantonesList:', e)
    }
    return await backupService.getCantonesList(idProvincia)
  },

  async getParroquiasList(idCanton?: string | number): Promise<any[]> {
    try {
      const supa = await supabaseService.getParroquias(idCanton)
      if (supa && supa.length > 0) return supa
    } catch (e) {
      console.warn('[dbService] Error con Supabase en getParroquiasList:', e)
    }
    return await backupService.getParroquiasList(idCanton)
  },

  async getBarriosList(idParroquia?: string | number): Promise<any[]> {
    try {
      const supa = await supabaseService.getBarrios(idParroquia)
      if (supa && supa.length > 0) return supa
    } catch (e) {
      console.warn('[dbService] Error con Supabase en getBarriosList:', e)
    }
    return await backupService.getBarriosList(idParroquia)
  },

  // ==========================================
  // PRODUCTORES
  // ==========================================
  async getProductores(): Promise<Productor[]> {
    try {
      const supaData = await supabaseService.getProductores()
      if (supaData && supaData.length > 0) {
        return supaData
      }
      console.warn('[dbService] Supabase devolvió 0 productores o aún no tiene datos. Cargando datos de respaldo local.')
    } catch (e) {
      console.warn('[dbService] Error en Supabase al obtener productores:', e)
    }
    return await backupService.getProductores()
  },

  async getProductorById(id: string | number): Promise<any> {
    try {
      const supa = await supabaseService.getProductorById(id)
      if (supa) return supa
    } catch (e) {
      console.warn(`[dbService] Error en Supabase getProductorById(${id}):`, e)
    }
    return await backupService.getProductorById(String(id))
  },

  async saveProductor(data: any): Promise<any> {
    try {
      await supabaseService.saveProductor(data)
    } catch (e) {
      console.warn('[dbService] No se pudo guardar en Supabase:', e)
    }
    return await backupService.saveProductor(data)
  },

  async deleteProductor(id: string | number): Promise<boolean> {
    return await backupService.deleteProductor(String(id))
  },

  // ==========================================
  // FERIAS AGROECOLÓGICAS
  // ==========================================
  async getFerias(): Promise<Feria[]> {
    try {
      const supaFerias = await supabaseService.getFerias()
      if (supaFerias && supaFerias.length > 0) {
        return supaFerias
      }
      console.warn('[dbService] Supabase devolvió 0 ferias. Cargando respaldo local.')
    } catch (e) {
      console.warn('[dbService] Error en Supabase getFerias:', e)
    }
    return await backupService.getFerias()
  },

  async getFeriaById(id: string | number): Promise<any> {
    try {
      const supa = await supabaseService.getFeriaById(id)
      if (supa) return supa
    } catch (e) {
      console.warn(`[dbService] Error en Supabase getFeriaById(${id}):`, e)
    }
    return await backupService.getFeriaById(String(id))
  },

  async saveFeria(data: any): Promise<any> {
    return await backupService.saveFeria(data)
  },

  async deleteFeria(id: string | number): Promise<boolean> {
    return await backupService.deleteFeria(String(id))
  },

  // ==========================================
  // ASOCIACIONES Y REDES
  // ==========================================
  async getAsociaciones(): Promise<Asociacion[]> {
    try {
      const supa = await supabaseService.getAsociaciones()
      if (supa && supa.length > 0) return supa
    } catch (e) {
      console.warn('[dbService] Error en getAsociaciones:', e)
    }
    return await backupService.getAsociaciones()
  },

  async getAsociacionById(id: string | number): Promise<any> {
    return await backupService.getAsociacionById(String(id))
  },

  async saveAsociacion(data: any): Promise<any> {
    return await backupService.saveAsociacion(data)
  },

  async deleteAsociacion(id: string | number): Promise<boolean> {
    return await backupService.deleteAsociacion(String(id))
  },

  async getRedes(): Promise<Red[]> {
    try {
      const supa = await supabaseService.getRedes()
      if (supa && supa.length > 0) return supa
    } catch (e) {
      console.warn('[dbService] Error en getRedes:', e)
    }
    return await backupService.getRedes()
  },

  async getRedById(id: string | number): Promise<any> {
    return await backupService.getRedById(String(id))
  },

  async saveRed(data: any): Promise<any> {
    return await backupService.saveRed(data)
  },

  async deleteRed(id: string | number): Promise<boolean> {
    return await backupService.deleteRed(String(id))
  },

  // ==========================================
  // AVALES Y AGROECOSISTEMAS
  // ==========================================
  async getAvalByProductor(idProductor: string | number): Promise<any> {
    try {
      const supa = await supabaseService.getAvalByProductorId(idProductor)
      if (supa) return supa
    } catch (e) {
      console.warn(`[dbService] Error en getAvalByProductor:`, e)
    }
    return await backupService.getAvalByProductor(idProductor)
  },

  async saveAval(data: any): Promise<any> {
    try {
      await supabaseService.saveAval(data)
    } catch (e) {
      console.warn('[dbService] Error al guardar Aval en Supabase:', e)
    }
    return true
  },

  async getAgroecosistemaByProductor(idProductor: string | number): Promise<any> {
    try {
      const supa = await supabaseService.getAgroecosistemaByProductor(idProductor)
      if (supa) return supa
    } catch (e) {
      console.warn(`[dbService] Error en getAgroecosistemaByProductor:`, e)
    }
    return await backupService.getAgroecosistemaByProductor(idProductor)
  },

  async saveAgroecosistema(data: any): Promise<any> {
    try {
      await supabaseService.saveAgroecosistema(data)
    } catch (e) {
      console.warn('[dbService] Error guardando Agroecosistema en Supabase:', e)
    }
    return await backupService.saveAgroecosistema(data)
  },

  // ==========================================
  // DIRECCIÓN
  // ==========================================
  async getDireccionById(id: string | number): Promise<any> {
    return await backupService.getDireccionById(id)
  }
}