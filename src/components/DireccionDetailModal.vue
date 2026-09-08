<template>
  <v-card class="rounded-lg elevation-2">
    <v-card-title class="d-flex align-center justify-space-between pa-4 border-b bg-grey-lighten-4">
      <div class="d-flex align-center">
        <v-icon color="teal" class="me-2">mdi-map-marker-radius</v-icon>
        <span class="text-h6 font-weight-bold">Detalle de Dirección</span>
      </div>
      <v-btn icon="mdi-close" variant="text" size="small" @click="$emit('close')"></v-btn>
    </v-card-title>

    <v-card-text class="pa-6">
      <v-row>
        <!-- Mapa interactivo -->
        <v-col cols="12" md="7">
          <div style="height: 340px; position: relative; border-radius: 8px; overflow: hidden; border: 1px solid #e0e0e0;">
            <l-map
              v-if="mapCenter[0] !== 0"
              :zoom="mapZoom"
              :center="mapCenter"
              :use-global-leaflet="false"
              style="height: 100%; width: 100%; z-index: 1;"
            >
              <l-tile-layer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                layer-type="base"
                name="OpenStreetMap"
              ></l-tile-layer>
              <l-marker :lat-lng="mapCenter"></l-marker>
            </l-map>
            <div v-else class="d-flex align-center justify-center h-100 bg-grey-lighten-3 text-grey">
              <div class="text-center">
                <v-icon size="large" color="grey-lighten-1">mdi-map-marker-off</v-icon>
                <div class="text-caption mt-2">Sin coordenadas registradas</div>
              </div>
            </div>
          </div>
        </v-col>

        <!-- Datos de la dirección -->
        <v-col cols="12" md="5">
          <div class="mb-4" v-if="direccion.idDireccion">
            <div class="text-caption text-grey font-weight-medium mb-1">ID Dirección</div>
            <div class="text-body-1 font-weight-medium">{{ direccion.idDireccion }}</div>
          </div>

          <div class="mb-4">
            <div class="text-caption text-grey font-weight-medium mb-1">Calles</div>
            <div class="text-body-1 font-weight-medium">{{ direccion.calles || 'N/A' }}</div>
          </div>

          <div class="mb-4" v-if="direccion.referencia">
            <div class="text-caption text-grey font-weight-medium mb-1">Referencia</div>
            <div class="text-body-1">{{ direccion.referencia }}</div>
          </div>

          <div class="mb-3" v-if="direccion.barrio || direccion.parroquia">
            <div class="text-caption text-grey font-weight-medium mb-1">Ubicación</div>
            <div class="text-body-2">
              {{ [direccion.barrio, direccion.parroquia, direccion.canton].filter(Boolean).join(', ') }}
            </div>
          </div>

          <v-row density="compact">
            <v-col cols="6" v-if="direccion.latitud">
              <div class="text-caption text-grey mb-1">Latitud</div>
              <div class="text-body-2 font-weight-medium">{{ direccion.latitud }}</div>
            </v-col>
            <v-col cols="6" v-if="direccion.longitud">
              <div class="text-caption text-grey mb-1">Longitud</div>
              <div class="text-body-2 font-weight-medium">{{ direccion.longitud }}</div>
            </v-col>
            <v-col cols="12" v-if="direccion.altitud">
              <div class="text-caption text-grey mb-1">Altitud (m.s.n.m)</div>
              <div class="text-body-2 font-weight-medium">{{ direccion.altitud }}</div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { dbService } from '@/services/db.service'
import 'leaflet/dist/leaflet.css'
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet'

const props = defineProps({
  idDireccion: {
    type: [String, Number],
    default: null
  },
  // Datos directos si ya se tienen (sin necesidad de fetchear)
  calles: {
    type: String,
    default: ''
  }
})

defineEmits(['close'])

const direccion = ref<any>({})
const mapCenter = ref<[number, number]>([0, 0])
const mapZoom = ref(15)

const loadDireccion = async () => {
  if (!props.idDireccion) {
    direccion.value = { calles: props.calles || 'Sin información de dirección' }
    return
  }
  try {
    const data = await dbService.getDireccionById(String(props.idDireccion))
    if (data) {
      direccion.value = data
      if (data.latitud && data.longitud) {
        mapCenter.value = [parseFloat(data.latitud), parseFloat(data.longitud)]
      }
    } else {
      direccion.value = { calles: props.calles || 'No se encontró la dirección' }
    }
  } catch (e) {
    console.error('Error cargando dirección:', e)
    direccion.value = { calles: props.calles || 'Error al cargar' }
  }
}

watch(() => props.idDireccion, loadDireccion)
onMounted(loadDireccion)
</script>
