<template>
  <v-container fluid class="pa-6">
    <div class="d-flex align-center justify-space-between mb-6">
      <div class="d-flex align-center">
        <v-btn icon="mdi-arrow-left" variant="text" @click="$router.push(`/productores/${$route.params.id}`)"></v-btn>
        <h1 class="text-h5 font-weight-bold ms-2">Detalle de Agroecosistema</h1>
      </div>
      <div>
        <v-btn color="primary" prepend-icon="mdi-pencil" class="text-none" @click="$router.push(`/productores/${$route.params.id}/agroecosistema/editar`)">Edit</v-btn>
      </div>
    </div>

    <v-card flat class="border rounded-lg pa-6 mb-6">
      <v-row>
        <v-col cols="12" md="6">
          <div class="text-subtitle-2 text-grey mb-1">ID Agroecosistema</div>
          <div class="text-body-1 font-weight-medium mb-4">{{ agroecosistema.idAgroecosistema || 'Cargando...' }}</div>

          <div class="text-subtitle-2 text-grey mb-1">Área (m²)</div>
          <div class="text-body-1 font-weight-medium mb-4">{{ agroecosistema.area }}</div>
        </v-col>
        <v-col cols="12" md="6">
          <div class="text-subtitle-2 text-grey mb-1">Tipo de Área</div>
          <div class="text-body-1 font-weight-medium mb-4">
            <v-chip color="success" size="small">{{ agroecosistema.tipoArea }}</v-chip>
          </div>

          <div class="text-subtitle-2 text-grey mb-1">Productos Asignados</div>
          <div class="d-flex flex-wrap gap-2 mb-4">
            <v-chip size="small" variant="outlined" v-for="prod in agroecosistema.productos" :key="prod">
              {{ prod }}
            </v-chip>
            <span v-if="!agroecosistema.productos || agroecosistema.productos.length === 0" class="text-caption text-grey">Ninguno</span>
          </div>
        </v-col>
      </v-row>
    </v-card>

    <v-card flat class="border rounded-lg">
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
                No hay coordenadas registradas para este agroecosistema.
              </div>
            </div>
          </v-col>

          <!-- Detalles de Dirección a la derecha -->
          <v-col cols="12" md="5">
            <div class="mb-4">
              <div class="text-subtitle-2 text-grey mb-1">Calles</div>
              <div class="text-body-1 font-weight-medium">{{ agroecosistema.direccion?.calles || 'N/A' }}</div>
            </div>
            
            <div class="mb-4">
              <div class="text-subtitle-2 text-grey mb-1">Referencia</div>
              <div class="text-body-1 font-weight-medium">{{ agroecosistema.direccion?.referencia || 'N/A' }}</div>
            </div>
            
            <v-row density="compact">
              <v-col cols="12" sm="6">
                <div class="text-subtitle-2 text-grey mb-1">Latitud</div>
                <div class="text-body-1 font-weight-medium">{{ agroecosistema.direccion?.latitud || 'N/A' }}</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-subtitle-2 text-grey mb-1">Longitud</div>
                <div class="text-body-1 font-weight-medium">{{ agroecosistema.direccion?.longitud || 'N/A' }}</div>
              </v-col>
              <v-col cols="12">
                <div class="text-subtitle-2 text-grey mb-1">Altitud (m.s.n.m)</div>
                <div class="text-body-1 font-weight-medium">{{ agroecosistema.direccion?.altitud || 'N/A' }}</div>
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
import { useRoute } from 'vue-router'
import { dbService } from '@/services/db.service'
import 'leaflet/dist/leaflet.css'
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet'

const route = useRoute()

const agroecosistema = ref<any>({
  idAgroecosistema: '',
  idDireccion: '',
  area: 0,
  tipoArea: '',
  productos: [],
  direccion: { latitud: null, longitud: null }
})

const mapCenter = ref([0, 0])
const mapZoom = ref(15)

onMounted(async () => {
  const idProductor = String(route.params.id)
  const agroData = await dbService.getAgroecosistemaByProductor(idProductor)
  
  if (agroData) {
    agroecosistema.value = agroData
    if (agroData.direccion?.latitud && agroData.direccion?.longitud) {
      mapCenter.value = [agroData.direccion.latitud, agroData.direccion.longitud]
    } else {
      // Default center if no coordinates
      mapCenter.value = [-2.900128, -79.005896]
    }
  }
})
</script>
