<template>
  <v-container fluid class="pa-6">
    <div class="d-flex align-center justify-space-between mb-6">
      <div class="d-flex align-center">
        <v-btn icon="mdi-arrow-left" variant="text" @click="$router.back()"></v-btn>
        <h1 class="text-h5 font-weight-bold ms-2">Detalle de Dirección</h1>
      </div>
    </div>

    <v-card flat class="border rounded-lg mb-6">
      <v-card-title class="bg-grey-lighten-4 py-3 text-subtitle-1 font-weight-bold d-flex align-center">
        <v-icon color="teal" class="me-2">mdi-map-marker-radius</v-icon>
        Ubicación Geográfica
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pa-4">
        <v-row>
          <!-- Mapa a la izquierda -->
          <v-col cols="12" md="7">
            <div style="height: 400px; position: relative; border-radius: 8px; overflow: hidden; border: 1px solid #e0e0e0;">
              <l-map
                v-if="mapCenter[0] !== 0"
                :zoom="mapZoom"
                :center="(mapCenter as any)"
                :use-global-leaflet="false"
                style="height: 100%; width: 100%; z-index: 1;"
              >
                <l-tile-layer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  layer-type="base"
                  name="OpenStreetMap"
                ></l-tile-layer>
                <l-marker :lat-lng="(mapCenter as any)"></l-marker>
              </l-map>
              <div v-else class="d-flex align-center justify-center h-100 bg-grey-lighten-3 text-grey">
                Cargando ubicación o sin coordenadas...
              </div>
            </div>
          </v-col>

          <!-- Detalles de Dirección a la derecha -->
          <v-col cols="12" md="5">
            <div class="mb-4">
              <div class="text-subtitle-2 text-grey mb-1">ID Dirección</div>
              <div class="text-body-1 font-weight-medium">{{ direccion?.idDireccion || 'N/A' }}</div>
            </div>
            <div class="mb-4">
              <div class="text-subtitle-2 text-grey mb-1">Calles</div>
              <div class="text-body-1 font-weight-medium">{{ direccion?.calles || 'N/A' }}</div>
            </div>
            
            <div class="mb-4">
              <div class="text-subtitle-2 text-grey mb-1">Referencia</div>
              <div class="text-body-1 font-weight-medium">{{ direccion?.referencia || 'N/A' }}</div>
            </div>

            <div class="mb-4">
              <div class="text-subtitle-2 text-grey mb-1">Ubicación Política</div>
              <div class="text-body-2">
                {{ direccion?.barrio }} <span v-if="direccion?.parroquia">, {{ direccion?.parroquia }}</span>
                <span v-if="direccion?.canton">, {{ direccion?.canton }}</span>
              </div>
            </div>
            
            <v-row density="compact">
              <v-col cols="12" sm="6">
                <div class="text-subtitle-2 text-grey mb-1">Latitud</div>
                <div class="text-body-1 font-weight-medium">{{ direccion?.latitud || 'N/A' }}</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-subtitle-2 text-grey mb-1">Longitud</div>
                <div class="text-body-1 font-weight-medium">{{ direccion?.longitud || 'N/A' }}</div>
              </v-col>
              <v-col cols="12">
                <div class="text-subtitle-2 text-grey mb-1">Altitud (m.s.n.m)</div>
                <div class="text-body-1 font-weight-medium">{{ direccion?.altitud || 'N/A' }}</div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { dbService } from '@/services/db.service'
import 'leaflet/dist/leaflet.css'
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet'

const route = useRoute()
const router = useRouter()

const direccion = ref<any>({})
const mapCenter = ref([0, 0])
const mapZoom = ref(15)

onMounted(async () => {
  const id = String(route.params.id)
  const data = await dbService.getDireccionById(id)
  if (data) {
    direccion.value = data
    if (data.latitud && data.longitud) {
      mapCenter.value = [data.latitud, data.longitud]
    } else {
      mapCenter.value = [-2.900128, -79.005896]
    }
  }
})
</script>
