<template>
  <v-card :flat="flat" class="border rounded-lg mb-6">
    <v-card-title v-if="title" class="bg-grey-lighten-4 py-3 text-subtitle-1 font-weight-bold d-flex align-center">
      <v-icon color="teal" class="me-2">mdi-map-marker-radius</v-icon>
      {{ title }}
    </v-card-title>
    <v-divider v-if="title"></v-divider>
    
    <v-card-text class="pa-5">
      <!-- Selectores Jerárquicos: Provincia -> Cantón -> Parroquia -->
      <v-row dense class="mb-3">
        <!-- Selector de Provincia -->
        <v-col cols="12" md="4">
          <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">
            Provincia *
          </label>
          <v-autocomplete
            v-model="selectedProvinciaId"
            :items="provincias"
            item-title="nombre"
            item-value="id_provincia"
            placeholder="Selecciona Provincia"
            variant="outlined"
            density="compact"
            hide-details
            clearable
            :loading="loadingProvincias"
            @update:model-value="onProvinciaChange"
          ></v-autocomplete>
        </v-col>

        <!-- Selector de Cantón -->
        <v-col cols="12" md="4">
          <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">
            Cantón *
          </label>
          <v-autocomplete
            v-model="selectedCantonId"
            :items="cantonesFiltrados"
            item-title="nombre"
            item-value="id_canton"
            :placeholder="selectedProvinciaId ? 'Selecciona Cantón' : 'Primero selecciona Provincia'"
            :disabled="!selectedProvinciaId"
            variant="outlined"
            density="compact"
            hide-details
            clearable
            :loading="loadingCantones"
            @update:model-value="onCantonChange"
          ></v-autocomplete>
        </v-col>

        <!-- Selector de Parroquia -->
        <v-col cols="12" md="4">
          <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">
            Parroquia *
          </label>
          <v-autocomplete
            v-model="selectedParroquiaId"
            :items="parroquiasFiltradas"
            item-title="nombre"
            item-value="id_parroquia"
            :placeholder="selectedCantonId ? 'Selecciona Parroquia' : 'Primero selecciona Cantón'"
            :disabled="!selectedCantonId"
            variant="outlined"
            density="compact"
            hide-details
            clearable
            :loading="loadingParroquias"
            @update:model-value="onParroquiaChange"
          ></v-autocomplete>
        </v-col>
      </v-row>

      <!-- Mapa interactivo con zoom progresivo -->
      <div class="mb-2 d-flex align-center justify-space-between">
        <span class="text-caption text-grey-darken-2">
          <v-icon size="small" color="primary" class="me-1">mdi-cursor-default-click</v-icon>
          Haz clic en el mapa para ajustar la ubicación exacta
        </span>
        <span v-if="mapZoom" class="text-caption text-grey">
          Zoom: {{ mapZoom }}
        </span>
      </div>

      <v-card flat class="border rounded-lg overflow-hidden mb-4" :height="mapHeight">
        <l-map 
          ref="leafletMapRef"
          :zoom="mapZoom" 
          :center="(mapCenter as any)" 
          style="height: 100%; width: 100%" 
          @click="onMapClick"
        >
          <l-tile-layer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
            layer-type="base" 
            name="OpenStreetMap"
          ></l-tile-layer>
          <l-marker 
            v-if="direccion.latitud && direccion.longitud" 
            :lat-lng="[direccion.latitud, direccion.longitud]"
          ></l-marker>
        </l-map>
      </v-card>
      
      <!-- Campos de Coordenadas y Detalles -->
      <v-row dense>
        <v-col cols="12" md="4">
          <v-text-field
            v-model.number="direccion.latitud"
            label="Latitud"
            variant="outlined"
            density="compact"
            type="number"
            hide-details
            readonly
            prepend-inner-icon="mdi-latitude"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model.number="direccion.longitud"
            label="Longitud"
            variant="outlined"
            density="compact"
            type="number"
            hide-details
            readonly
            prepend-inner-icon="mdi-longitude"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model.number="direccion.altitud"
            label="Altitud (m)"
            variant="outlined"
            density="compact"
            type="number"
            hide-details
            prepend-inner-icon="mdi-elevation-rise"
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="12" class="mt-2">
          <v-text-field
            v-model="direccion.calles"
            :label="callesLabel"
            variant="outlined"
            density="compact"
            hide-details
            prepend-inner-icon="mdi-road"
          ></v-text-field>
        </v-col>
        <v-col cols="12" class="mt-2">
          <v-textarea
            v-model="direccion.referencia"
            label="Referencia"
            variant="outlined"
            density="compact"
            rows="2"
            hide-details
            :placeholder="referenciaPlaceholder"
            prepend-inner-icon="mdi-information-outline"
          ></v-textarea>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { Direccion } from '@/types'
import { dbService } from '@/services/db.service'
import 'leaflet/dist/leaflet.css'
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet'

const props = withDefaults(
  defineProps<{
    title?: string
    flat?: boolean
    mapHeight?: number | string
    callesLabel?: string
    referenciaPlaceholder?: string
  }>(),
  {
    title: 'Ubicación Geográfica (Dirección) *',
    flat: true,
    mapHeight: 380,
    callesLabel: 'Calles (Ej. Bolívar y Tarqui)',
    referenciaPlaceholder: 'Detalles para encontrar el lugar'
  }
)

const direccion = defineModel<Direccion>({
  default: () => ({
    latitud: null,
    longitud: null,
    altitud: null,
    calles: '',
    referencia: '',
    id_provincia: null,
    id_canton: null,
    id_parroquia: null,
    provincia: '',
    canton: '',
    parroquia: ''
  })
})

const defaultCenter: [number, number] = [-2.900128, -79.005896]
const mapCenter = ref<[number, number]>(defaultCenter)
const mapZoom = ref<number>(13)
const leafletMapRef = ref<any>(null)

// Listas de datos geográficos
const provincias = ref<any[]>([])
const cantonesFiltrados = ref<any[]>([])
const parroquiasFiltradas = ref<any[]>([])

// IDs seleccionados
const selectedProvinciaId = ref<string | null>(null)
const selectedCantonId = ref<string | null>(null)
const selectedParroquiaId = ref<string | null>(null)

const loadingProvincias = ref(false)
const loadingCantones = ref(false)
const loadingParroquias = ref(false)

const fetchElevation = async (lat: number, lng: number) => {
  try {
    const response = await fetch(`https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lng}`)
    if (response.ok) {
      const data = await response.json()
      if (data.elevation && data.elevation.length > 0 && direccion.value) {
        direccion.value.altitud = parseFloat(data.elevation[0].toFixed(2))
      }
    }
  } catch (error) {
    console.error('Error fetching elevation:', error)
  }
}

// 1. Cambio de Provincia
const onProvinciaChange = async (provinciaId: string | null) => {
  selectedCantonId.value = null
  selectedParroquiaId.value = null
  cantonesFiltrados.value = []
  parroquiasFiltradas.value = []

  if (!direccion.value) direccion.value = {}

  if (!provinciaId) {
    direccion.value.id_provincia = null
    direccion.value.provincia = ''
    direccion.value.id_canton = null
    direccion.value.canton = ''
    direccion.value.id_parroquia = null
    direccion.value.parroquia = ''
    return
  }

  const prov = provincias.value.find(
    (p: any) => String(p.id_provincia || p.codigo_dpa || p.IdProvincia) === String(provinciaId)
  )

  if (prov) {
    direccion.value.id_provincia = prov.codigo_dpa || prov.id_provincia
    direccion.value.provincia = prov.nombre || prov.Nombre

    // Coordenadas de Provincia y Zoom a nivel provincial (zoom 8-9)
    if (prov.latitud !== undefined && prov.longitud !== undefined) {
      const lat = Number(prov.latitud)
      const lng = Number(prov.longitud)
      direccion.value.latitud = parseFloat(lat.toFixed(6))
      direccion.value.longitud = parseFloat(lng.toFixed(6))
      mapCenter.value = [lat, lng]
      mapZoom.value = 9
    }
  }

  // Cargar cantones de la provincia
  loadingCantones.value = true
  try {
    cantonesFiltrados.value = await dbService.getCantonesList(provinciaId)
  } finally {
    loadingCantones.value = false
  }
}

// 2. Cambio de Cantón
const onCantonChange = async (cantonId: string | null) => {
  selectedParroquiaId.value = null
  parroquiasFiltradas.value = []

  if (!direccion.value) direccion.value = {}

  if (!cantonId) {
    direccion.value.id_canton = null
    direccion.value.canton = ''
    direccion.value.id_parroquia = null
    direccion.value.parroquia = ''
    return
  }

  const can = cantonesFiltrados.value.find(
    (c: any) => String(c.id_canton || c.codigo_dpa || c.IdCanton) === String(cantonId)
  )

  if (can) {
    direccion.value.id_canton = can.codigo_dpa || can.id_canton
    direccion.value.canton = can.nombre || can.Nombre

    // Coordenadas del Cantón y Zoom a nivel cantonal (zoom 12-13)
    if (can.latitud !== undefined && can.longitud !== undefined) {
      const lat = Number(can.latitud)
      const lng = Number(can.longitud)
      direccion.value.latitud = parseFloat(lat.toFixed(6))
      direccion.value.longitud = parseFloat(lng.toFixed(6))
      mapCenter.value = [lat, lng]
      mapZoom.value = 12
    }
  }

  // Cargar parroquias del cantón
  loadingParroquias.value = true
  try {
    parroquiasFiltradas.value = await dbService.getParroquiasList(cantonId)
  } finally {
    loadingParroquias.value = false
  }
}

// 3. Cambio de Parroquia
const onParroquiaChange = async (parroquiaId: string | null) => {
  if (!direccion.value) direccion.value = {}

  if (!parroquiaId) {
    direccion.value.id_parroquia = null
    direccion.value.parroquia = ''
    return
  }

  const parr = parroquiasFiltradas.value.find(
    (p: any) => String(p.id_parroquia || p.codigo_dpa || p.IdParroquia) === String(parroquiaId)
  )

  if (parr) {
    direccion.value.id_parroquia = parr.codigo_dpa || parr.id_parroquia
    direccion.value.parroquia = parr.nombre || parr.Nombre

    // Coordenadas de la Parroquia y Zoom a nivel parroquial (zoom 15)
    if (parr.latitud !== undefined && parr.longitud !== undefined) {
      const lat = Number(parr.latitud)
      const lng = Number(parr.longitud)
      direccion.value.latitud = parseFloat(lat.toFixed(6))
      direccion.value.longitud = parseFloat(lng.toFixed(6))
      mapCenter.value = [lat, lng]
      mapZoom.value = 15

      // Consultar elevación para la parroquia
      fetchElevation(lat, lng)
    }
  }
}

// Clic en el mapa para ajustar ubicación exacta
const onMapClick = async (e: any) => {
  if (e && e.latlng) {
    const lat = e.latlng.lat
    const lng = e.latlng.lng
    
    if (!direccion.value) {
      direccion.value = {}
    }

    direccion.value.latitud = parseFloat(lat.toFixed(6))
    direccion.value.longitud = parseFloat(lng.toFixed(6))
    mapCenter.value = [lat, lng]

    fetchElevation(lat, lng)
  }
}

// Sincronización de ubicación desde el modelo hacia los selectores y el mapa
const isSyncing = ref(false)

const syncLocationFromModel = async () => {
  if (isSyncing.value || !direccion.value) return
  isSyncing.value = true

  try {
    if (!provincias.value || provincias.value.length === 0) {
      loadingProvincias.value = true
      provincias.value = await dbService.getProvinciasList()
      loadingProvincias.value = false
    }

    if (direccion.value.latitud && direccion.value.longitud) {
      mapCenter.value = [Number(direccion.value.latitud), Number(direccion.value.longitud)]
      mapZoom.value = 15
    }

    const targetProv = direccion.value.id_provincia || direccion.value.provincia
    if (targetProv) {
      const foundProv = provincias.value.find(
        (p: any) =>
          String(p.id_provincia || p.codigo_dpa || p.IdProvincia) === String(targetProv) ||
          p.nombre?.trim().toUpperCase() === String(targetProv).trim().toUpperCase() ||
          p.Nombre?.trim().toUpperCase() === String(targetProv).trim().toUpperCase()
      )
      if (foundProv) {
        const provId = foundProv.id_provincia || foundProv.codigo_dpa || foundProv.IdProvincia
        if (selectedProvinciaId.value !== provId) {
          selectedProvinciaId.value = provId
          cantonesFiltrados.value = await dbService.getCantonesList(provId)
        }

        const targetCanton = direccion.value.id_canton || direccion.value.canton
        if (targetCanton) {
          const foundCan = cantonesFiltrados.value.find(
            (c: any) =>
              String(c.id_canton || c.codigo_dpa || c.IdCanton) === String(targetCanton) ||
              c.nombre?.trim().toUpperCase() === String(targetCanton).trim().toUpperCase() ||
              c.Nombre?.trim().toUpperCase() === String(targetCanton).trim().toUpperCase()
          )
          if (foundCan) {
            const cantonId = foundCan.id_canton || foundCan.codigo_dpa || foundCan.IdCanton
            if (selectedCantonId.value !== cantonId) {
              selectedCantonId.value = cantonId
              parroquiasFiltradas.value = await dbService.getParroquiasList(cantonId)
            }

            const targetParr = direccion.value.id_parroquia || direccion.value.parroquia
            if (targetParr) {
              const foundParr = parroquiasFiltradas.value.find(
                (pa: any) =>
                  String(pa.id_parroquia || pa.codigo_dpa || pa.IdParroquia) === String(targetParr) ||
                  pa.nombre?.trim().toUpperCase() === String(targetParr).trim().toUpperCase() ||
                  pa.Nombre?.trim().toUpperCase() === String(targetParr).trim().toUpperCase()
              )
              if (foundParr) {
                selectedParroquiaId.value = foundParr.id_parroquia || foundParr.codigo_dpa || foundParr.IdParroquia
              }
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('Error sincronizando ubicación en DireccionForm:', err)
  } finally {
    isSyncing.value = false
  }
}

// Inicialización de datos
onMounted(async () => {
  loadingProvincias.value = true
  try {
    provincias.value = await dbService.getProvinciasList()
  } finally {
    loadingProvincias.value = false
  }
  await syncLocationFromModel()
})

// Sincronización si cambian las coordenadas o la ubicación externamente
watch(
  () => [
    direccion.value?.id_provincia,
    direccion.value?.provincia,
    direccion.value?.id_canton,
    direccion.value?.canton,
    direccion.value?.id_parroquia,
    direccion.value?.parroquia,
    direccion.value?.latitud,
    direccion.value?.longitud
  ],
  () => {
    syncLocationFromModel()
  }
)
</script>
