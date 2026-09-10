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
import asoRedData from '@/db/asociacionred.json'
import redFeriaData from '@/db/redferia.json'
import horarioData from '@/db/horario.json'


import configuracionAvalData from '@/db/configuracion_aval.json'
import agroecosistemaData from '@/db/agroecosistema.json'

import type { User, Productor, Asociacion, Red, Feria } from '@/types'

const dictDireccion = new Map(direccionData.map((d: any) => [d.IdDireccion, d]));
const dictBarrio = new Map(barrioData.map((b: any) => [b.IdBarrioComunidad, b]));
const dictParroquia = new Map(parroquiaData.map((p: any) => [p.IdParroquia, p]));
const dictCanton = new Map(cantonData.map((c: any) => [c.IdCanton, c]));
const dictProvincia = new Map(provinciaData.map((pr: any) => [pr.IdProvincia, pr]));

const dictAsociacionProductores = new Map();
productorAsociacionData.forEach((pa: any) => {
  const aId = String(pa.IdAsociacion || pa.id_asociacion);
  dictAsociacionProductores.set(aId, (dictAsociacionProductores.get(aId) || 0) + 1);
});

export const dbService = {
  // Usuario
  async getUser(): Promise<User> {
    return { ...userData }
  },

  // Provincias
  async getProvincias(): Promise<string[]> {
    const list = provinciaData.map((p: any) => p.Nombre || p.nombre).filter(Boolean)
    return ['All', ...list]
  },

  async getProvinciasList(): Promise<any[]> {
    return [...provinciaData]
  },

  async getCantonesList(idProvincia?: string | number): Promise<any[]> {
    if (!idProvincia) return [...cantonData]
    return cantonData.filter((c: any) => String(c.id_provincia || c.IdProvincia) === String(idProvincia))
  },

  async getParroquiasList(idCanton?: string | number): Promise<any[]> {
    if (!idCanton) return [...parroquiaData]
    return parroquiaData.filter((p: any) => String(p.id_canton || p.IdCanton) === String(idCanton))
  },

  async getBarriosList(idParroquia?: string | number): Promise<any[]> {
    if (!idParroquia) return [...barrioData]
    return barrioData.filter((b: any) => String(b.id_parroquia || b.IdParroquia) === String(idParroquia))
  },

  // Productores
  async getProductores(): Promise<Productor[]> {
    return productorData.map((p: any, idx: number) => {
      const direccion = dictDireccion.get(p.IdDireccion)
      const barrio = dictBarrio.get(direccion?.IdComunidad)
      const parroquia = dictParroquia.get(barrio?.IdParroquia)
      const canton = dictCanton.get(parroquia?.IdCanton)
      const provincia = dictProvincia.get(canton?.IdProvincia)

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
    const p: any = productorData.find((prod: any) => String(prod.IdProductor) === String(id) || String(prod.id_productor) === String(id))
    if (!p) return null

    const pId = p.IdProductor || p.id_productor
    let direccion: any = direccionData.find((d: any) => String(d.IdDireccion) === String(p.IdDireccion))
    if (!direccion && p.IdProductor) {
      direccion = direccionData.find((d: any) => String(d.IdDireccion) === String(p.IdProductor))
    }
    const barrio: any = barrioData.find((b: any) => b.IdBarrioComunidad === direccion?.IdComunidad)
    const parroquia: any = parroquiaData.find((pa: any) => pa.IdParroquia === barrio?.IdParroquia)
    const canton: any = cantonData.find((c: any) => c.IdCanton === parroquia?.IdCanton)
    const provincia: any = provinciaData.find((pr: any) => pr.IdProvincia === canton?.IdProvincia)
    
    const avalConfig: any = configuracionAvalData[0]

    // Fetch asociacion relations
    const asoRel = productorAsociacionData.filter(
      (pa: any) =>
        String(pa.IdProductor) === String(id) ||
        String(pa.id_productor) === String(id) ||
        (p.id_productor && (String(pa.IdProductor) === String(p.id_productor) || String(pa.id_productor) === String(p.id_productor))) ||
        (p.IdProductor && (String(pa.IdProductor) === String(p.IdProductor) || String(pa.id_productor) === String(p.IdProductor)))
    )
    const asociaciones = asoRel.map((pa: any) => {
      const aId = pa.IdAsociacion || pa.id_asociacion
      const a: any = asociacionData.find((asoc: any) => String(asoc.IdAsociacion) === String(aId) || String(asoc.id_asociacion) === String(aId))
      return {
        idProductorAsociacion: pa.IdProductorAsociacion,
        idAsociacion: aId,
        asociacion: a ? (a.Nombre || a.nombre) : `Aso ${aId}`
      }
    })

    const direccionCompleta = {
      id_direccion: direccion?.IdDireccion,
      latitud: direccion?.Latitud !== undefined ? Number(direccion.Latitud) : null,
      longitud: direccion?.Longitud !== undefined ? Number(direccion.Longitud) : null,
      altitud: direccion?.Altitud !== undefined ? Number(direccion.Altitud) : null,
      calles: direccion?.Calles || '',
      referencia: direccion?.Referencia || '',
      id_provincia: provincia?.IdProvincia || provincia?.codigo_dpa || null,
      id_canton: canton?.IdCanton || canton?.codigo_dpa || null,
      id_parroquia: parroquia?.IdParroquia || parroquia?.codigo_dpa || null,
      provincia: provincia?.Nombre || 'Azuay',
      canton: canton?.Nombre || '',
      parroquia: parroquia?.Nombre || '',
      barrio: barrio?.Nombre || ''
    }

    return {
      id: pId,
      nombres: p.Nombres || '',
      apellidos: p.Apellidos || '',
      nombre: `${p.Nombres || ''} ${p.Apellidos || ''}`.trim(),
      nombresCompletos: `${p.Nombres || ''} ${p.Apellidos || ''}`.trim(),
      cedula: p.Cedula || '',
      contacto: p.Contacto || '',
      email: p.Email || p.email || '',
      actividadEconomica: p.ActividadEconomica || 'Agroproductor',
      asociaciones,
      direccion: direccionCompleta,
      ubicacion: {
        barrio: barrio?.Nombre || 'Desconocido',
        parroquia: parroquia?.Nombre || 'Desconocido',
        canton: canton?.Nombre || 'Desconocido',
        provincia: provincia?.Nombre || 'Desconocido',
        idDireccion: p.IdDireccion,
        calles: direccion?.Calles || 'Sin calles',
        referencia: direccion?.Referencia || '',
        latitud: direccionCompleta.latitud,
        longitud: direccionCompleta.longitud,
        altitud: direccionCompleta.altitud
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

  async getAgroecosistemaByProductor(idProductor: string | number): Promise<any> {
    const productor: any = productorData.find(
      (p: any) => String(p.IdProductor) === String(idProductor) || String(p.id_productor) === String(idProductor)
    )

    const uuid = productor?.id_productor || idProductor
    const agroId = productor?.IdAgroecosistema

    const a: any = agroecosistemaData.find(
      (agro: any) =>
        String(agro.IdProductor) === String(uuid) ||
        String(agro.id_productor_uuid) === String(uuid) ||
        String(agro.IdAgroecosistema) === String(agroId) ||
        String(agro.IdProductor) === String(idProductor)
    )
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
    const productor: any = productorData.find(
      (p: any) => String(p.IdProductor) === String(idProductor) || String(p.id_productor) === String(idProductor)
    )

    const uuid = productor?.id_productor || idProductor

    const a: any = avalData.find(
      (av: any) => String(av.id_productor) === String(uuid) || String(av.id_productor) === String(idProductor)
    )
    if (!a) return null

    const formatExcelDate = (serial: any) => {
      if (!serial) return ''
      if (typeof serial === 'string' && serial.includes('-')) return serial
      const date = new Date((Number(serial) - 25569) * 86400 * 1000)
      return !isNaN(date.getTime()) ? date.toISOString().split('T')[0] : String(serial)
    }

    const entidad = entidadControlData.find((e: any) => e.IdEntidadControl === a.IdEntidadControl)

    return {
      id: a.IdAval,
      idEntidadControl: entidad?.Nombre || a.IdEntidadControl || 'EDEC',
      nombre: a.Nombre,
      estado: a.Estado,
      fechaOtorga: formatExcelDate(a.FechaOtorga),
      fechaFinaliza: formatExcelDate(a.FechaFinaliza),
      idProductor: productor ? `${productor.Nombres || ''} ${productor.Apellidos || ''}`.trim() : `Productor #${idProductor}`
    }
  },

  // Asociaciones
  async getAsociaciones(): Promise<Asociacion[]> {
    return asociacionData.map((a: any) => {
      const aId = String(a.id_asociacion || a.IdAsociacion);
      const sociosCount = dictAsociacionProductores.get(aId) || 0;

      return {
        id: a.id_asociacion || a.IdAsociacion,
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
  },


  async getAsociacionById(id: string): Promise<any> {
    const a = asociacionData.find((asoc: any) => String(asoc.IdAsociacion) === String(id) || String(asoc.id_asociacion) === String(id));
    if (!a) return null;

    const prods = productorAsociacionData.filter(
      (pa: any) =>
        String(pa.IdAsociacion) === String(a.IdAsociacion) ||
        (a.id_asociacion && String(pa.IdAsociacion) === String(a.id_asociacion)) ||
        String(pa.id_asociacion) === String(a.IdAsociacion) ||
        (a.id_asociacion && String(pa.id_asociacion) === String(a.id_asociacion))
    );
    const productores = prods.map((pa: any) => {
      const pId = pa.IdProductor || pa.id_productor;
      const prod: any = productorData.find((p: any) => String(p.IdProductor) === String(pId) || String(p.id_productor) === String(pId));
      return { id: pId, nombre: prod ? `${prod.Nombres || ''} ${prod.Apellidos || ''}`.trim() : `Productor ${pId}` };
    });

    const redesRel = asoRedData.filter(
      (ar: any) =>
        String(ar.IdAsociacion) === String(a.IdAsociacion) ||
        (a.id_asociacion && String(ar.IdAsociacion) === String(a.id_asociacion)) ||
        String(ar.id_asociacion) === String(a.IdAsociacion) ||
        (a.id_asociacion && String(ar.id_asociacion) === String(a.id_asociacion))
    );
    const redes = redesRel.map((ar: any) => {
      const rId = ar.IdRed || ar.id_red;
      const red: any = redData.find((r: any) => String(r.IdRed) === String(rId) || String(r.id_red) === String(rId));
      return { id: rId, nombre: red ? (red.Nombre || red.nombre) : `Red ${rId}` };
    });

    const redIds = redes.map((r: any) => r.id);
    const feriaRel = redFeriaData.filter((rf: any) => redIds.includes(rf.IdRed || rf.id_red));
    const ferias = feriaRel.map((rf: any) => {
      const fId = rf.IdFeria || rf.id_feria;
      const f: any = feriaData.find((feria: any) => String(feria.IdFeriaAgroecologica) === String(fId) || String(feria.id_feria_agroecologica) === String(fId));
      return { id: fId, nombre: f ? (f.Nombre || f.nombre) : `Feria ${fId}` };
    });

    const prodIds = productores.map((p: any) => p.id);
    const prodUuidsAndIds = new Set();
    prodIds.forEach(pId => {
      prodUuidsAndIds.add(String(pId));
      const p = productorData.find((prod: any) => String(prod.IdProductor) === String(pId) || String(prod.id_productor) === String(pId));
      if (p) {
        prodUuidsAndIds.add(String(p.IdProductor));
        if (p.id_productor) prodUuidsAndIds.add(String(p.id_productor));
      }
    });

    const products = new Set<string>();
    agroecosistemaData.forEach((agro: any) => {
      if (prodUuidsAndIds.has(String(agro.IdProductor)) || prodUuidsAndIds.has(String(agro.id_productor_uuid))) {
        if (Array.isArray(agro.productos_nombres)) {
          agro.productos_nombres.forEach((prod: string) => products.add(prod));
        }
      }
    });

    return {
      id: (a as any).id_asociacion || (a as any).IdAsociacion,
      nombre: (a as any).Nombre || (a as any).nombre,
      productores,
      redes,
      ferias,
      productos: Array.from(products)
    };
  },

  async getRedById(id: string): Promise<any> {
    const r: any = redData.find((red: any) => String(red.IdRed) === String(id) || String(red.id_red) === String(id));
    if (!r) return null;

    const rId = r.IdRed || r.id_red;

    const asoRel = asoRedData.filter((ar: any) => String(ar.IdRed) === String(rId) || String(ar.id_red) === String(rId));
    const asociaciones = asoRel.map((ar: any) => {
      const aId = ar.IdAsociacion || ar.id_asociacion;
      const a: any = asociacionData.find((asoc: any) => String(asoc.IdAsociacion) === String(aId) || String(asoc.id_asociacion) === String(aId));
      return {
        idRelacion: ar.IdAsociacionRed || ar.id_asociacion_red,
        idAsociacion: aId,
        asociacion: a ? (a.Nombre || a.nombre) : `Aso ${aId}`,
        red: r.Nombre || r.nombre
      };
    });

    const feriaRel = redFeriaData.filter((rf: any) => String(rf.IdRed) === String(rId) || String(rf.id_red) === String(rId));
    const ferias = feriaRel.map((rf: any) => {
      const fId = rf.IdFeria || rf.id_feria;
      const f: any = feriaData.find((feria: any) => String(feria.IdFeriaAgroecologica) === String(fId) || String(feria.id_feria_agroecologica) === String(fId));
      return {
        idRelacion: rf.IdRedFeria || rf.id_red_feria,
        idFeria: fId,
        feria: f ? (f.Nombre || f.nombre) : `Feria ${fId}`,
        red: r.Nombre || r.nombre
      };
    });

    return {
      id: rId,
      nombre: r.Nombre || r.nombre,
      asociaciones,
      ferias
    };
  },

  async getFeriaById(id: string): Promise<any> {
    const f: any = feriaData.find((feria: any) => String(feria.IdFeriaAgroecologica) === String(id) || String(feria.id_feria_agroecologica) === String(id));
    if (!f) return null;

    const fId = f.IdFeriaAgroecologica || f.id_feria_agroecologica;

    const dir = direccionData.find((d: any) => String(d.IdDireccion) === String(f.IdDireccion || f.id_direccion));
    
    // Ferias -> Redes -> Asociaciones -> Productores -> Productos
    const redesRel = redFeriaData.filter((rf: any) => String(rf.IdFeria) === String(fId) || String(rf.id_feria) === String(fId));
    const redIds = redesRel.map((rf: any) => rf.IdRed || rf.id_red);

    const asoRel = asoRedData.filter((ar: any) => redIds.includes(ar.IdRed || ar.id_red));
    const asoIds = asoRel.map((ar: any) => ar.IdAsociacion || ar.id_asociacion);

    const prodRel = productorAsociacionData.filter((pa: any) => asoIds.includes(pa.IdAsociacion || pa.id_asociacion));
    const prodIds = prodRel.map((pa: any) => pa.IdProductor || pa.id_productor);

    // Map numeric prodIds to UUIDs and vice versa just in case
    const prodUuidsAndIds = new Set();
    prodIds.forEach(pId => {
      prodUuidsAndIds.add(String(pId));
      const p = productorData.find((prod: any) => String(prod.IdProductor) === String(pId) || String(prod.id_productor) === String(pId));
      if (p) {
        prodUuidsAndIds.add(String(p.IdProductor));
        if (p.id_productor) prodUuidsAndIds.add(String(p.id_productor));
      }
    });

    const products = new Set<string>();
    agroecosistemaData.forEach((agro: any) => {
      if (prodUuidsAndIds.has(String(agro.IdProductor)) || prodUuidsAndIds.has(String(agro.id_productor_uuid))) {
        if (Array.isArray(agro.productos_nombres)) {
          agro.productos_nombres.forEach((prod: string) => products.add(prod));
        }
      }
    });

    const horarios = horarioData.filter((h: any) => String(h.id_feria) === String(fId) || String(h.IdFeria) === String(fId)).map((h: any) => {
      return {
        idHorario: h.IdHorario,
        horaApertura: h.HoraApertura,
        horaCierre: h.HoraCierre,
        dia: h.Dia,
        idFeria: fId
      };
    });

    return {
      id: fId,
      nombre: f.Nombre || f.nombre,
      idDireccion: f.IdDireccion || f.id_direccion,
      calles: dir ? dir.Calles : 'Ubicación Desconocida',
      redes: redesRel.map((rf: any) => {
        const rId = rf.IdRed || rf.id_red;
        const red: any = redData.find((r: any) => String(r.IdRed) === String(rId) || String(r.id_red) === String(rId));
        return { idRedFeria: rf.IdRedFeria, idFeria: fId, idRed: red ? (red.Nombre || red.nombre) : rId, rawRedId: rId };
      }),
      horarios,
      productos: Array.from(products)
    };
  },

  async deleteProductor(id: string): Promise<boolean> {
    const idx = productorData.findIndex((p: any) => String(p.IdProductor) === String(id) || String(p.id_productor) === String(id));
    if (idx !== -1) {
      productorData.splice(idx, 1);
      return true;
    }
    return true;
  },

  async deleteAsociacion(id: string): Promise<boolean> {
    const idx = asociacionData.findIndex((a: any) => String(a.IdAsociacion) === String(id) || String(a.id_asociacion) === String(id));
    if (idx !== -1) {
      asociacionData.splice(idx, 1);
      return true;
    }
    return true;
  },

  async deleteRed(id: string): Promise<boolean> {
    const idx = redData.findIndex((r: any) => String(r.IdRed) === String(id) || String(r.id_red) === String(id));
    if (idx !== -1) {
      redData.splice(idx, 1);
      return true;
    }
    return true;
  },

  async deleteFeria(id: string): Promise<boolean> {
    const idx = feriaData.findIndex((f: any) => String(f.IdFeriaAgroecologica) === String(id) || String(f.id_feria_agroecologica) === String(id));
    if (idx !== -1) {
      feriaData.splice(idx, 1);
      return true;
    }
    return true;
  },

  async saveProductor(data: any): Promise<boolean> {
    const arr = productorData as any[];
    const idx = arr.findIndex((p: any) => String(p.IdProductor) === String(data.id) || String(p.id_productor) === String(data.id));
    const nombres = data.nombres || (data.nombre ? data.nombre.split(' ')[0] : '');
    const apellidos = data.apellidos || (data.nombre ? data.nombre.split(' ').slice(1).join(' ') : '');
    if (idx !== -1) {
      arr[idx] = {
        ...arr[idx],
        Nombres: nombres,
        Apellidos: apellidos,
        Cedula: data.cedula,
        Contacto: data.contacto,
        Email: data.email,
        ActividadEconomica: data.actividadEconomica || data.tipo
      };
    } else {
      arr.push({
        IdProductor: data.id || `PROD-${Math.floor(1000 + Math.random() * 9000)}`,
        Nombres: nombres,
        Apellidos: apellidos,
        Cedula: data.cedula,
        Contacto: data.contacto,
        Email: data.email,
        ActividadEconomica: data.actividadEconomica || 'General'
      });
    }

    if (data.direccion) {
      const dirIdx = direccionData.findIndex(
        (d: any) =>
          String(d.IdDireccion) === String(arr[idx]?.IdDireccion) ||
          String(d.IdDireccion) === String(data.id)
      );
      if (dirIdx !== -1) {
        (direccionData as any[])[dirIdx] = {
          ...(direccionData as any[])[dirIdx],
          Latitud: data.direccion.latitud,
          Longitud: data.direccion.longitud,
          Altitud: data.direccion.altitud,
          Calles: data.direccion.calles,
          Referencia: data.direccion.referencia
        };
      }
    }

    return true;
  },

  async saveAsociacion(data: any): Promise<boolean> {
    const arr = asociacionData as any[];
    const idx = arr.findIndex((a: any) => String(a.IdAsociacion) === String(data.id) || String(a.id_asociacion) === String(data.id));
    if (idx !== -1) {
      arr[idx] = {
        ...arr[idx],
        Nombre: data.nombre,
        nombre: data.nombre
      };
    } else {
      arr.push({
        IdAsociacion: data.id || `ASO-${Math.floor(10 + Math.random() * 90)}`,
        Nombre: data.nombre,
        nombre: data.nombre
      });
    }
    return true;
  },

  async saveRed(data: any): Promise<boolean> {
    const arr = redData as any[];
    const idx = arr.findIndex((r: any) => String(r.IdRed) === String(data.id) || String(r.id_red) === String(data.id));
    if (idx !== -1) {
      arr[idx] = {
        ...arr[idx],
        Nombre: data.nombre,
        nombre: data.nombre
      };
    } else {
      arr.push({
        IdRed: data.id || `RED-${Math.floor(10 + Math.random() * 90)}`,
        Nombre: data.nombre,
        nombre: data.nombre
      });
    }
    return true;
  },

  async saveFeria(data: any): Promise<boolean> {
    const arr = feriaData as any[];
    const idx = arr.findIndex((f: any) => String(f.IdFeriaAgroecologica) === String(data.id) || String(f.id_feria_agroecologica) === String(data.id));
    if (idx !== -1) {
      arr[idx] = {
        ...arr[idx],
        Nombre: data.nombre,
        nombre: data.nombre
      };
    } else {
      arr.push({
        IdFeriaAgroecologica: data.id || `FERIA-${Math.floor(100 + Math.random() * 900)}`,
        Nombre: data.nombre,
        nombre: data.nombre
      });
    }
    return true;
  },

  async saveAgroecosistema(data: any): Promise<boolean> {
    const arr = agroecosistemaData as any[];
    const idx = arr.findIndex((ag: any) => String(ag.idAgroecosistema) === String(data.id) || String(ag.IdAgroecosistema) === String(data.id));
    if (idx !== -1) {
      arr[idx] = {
        ...arr[idx],
        area: data.area,
        tipoArea: data.tipoArea,
        productos_nombres: data.productos || [],
        plantas: data.plantas || [],
        direccion: { ...(arr[idx].direccion || {}), ...(data.direccion || {}) }
      };
    } else {
      arr.push({
        idAgroecosistema: data.id || `AGR-${Math.floor(1000 + Math.random() * 9000)}`,
        IdProductor: data.idProductor,
        area: data.area,
        tipoArea: data.tipoArea,
        productos_nombres: data.productos || [],
        plantas: data.plantas || [],
        direccion: data.direccion || {}
      });
    }
    return true;
  }
}
