<template>
  <v-container fluid class="pa-6" style="max-width: 800px;">
    <v-card class="rounded-lg border" flat>
      <v-card-title class="d-flex align-center justify-space-between pa-4 border-b bg-grey-lighten-4">
        <div class="d-flex align-center">
          <v-btn icon="mdi-arrow-left" variant="text" size="small" @click="$router.back()"></v-btn>
          <span class="text-h6 font-weight-bold ms-2">Formulario de Agroecosistema</span>
        </div>
        <div>
          <v-btn variant="text" class="me-2 text-none" @click="$router.back()">Cancel</v-btn>
          <v-btn color="primary" class="text-none" :disabled="!formValido" @click="guardar">
            Save
          </v-btn>
        </div>
      </v-card-title>

      <v-card-text class="pa-6">
        <v-form ref="formRef" v-model="formValido">
          <v-row>
            <v-col cols="12" sm="6">
              <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">
                ID Agroecosistema *
              </label>
              <v-text-field
                v-model="form.id"
                variant="outlined"
                density="compact"
                hide-details
                readonly
                bg-color="grey-lighten-4"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">
                ID Productor *
              </label>
              <v-text-field
                v-model="form.idProductor"
                variant="outlined"
                density="compact"
                hide-details
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row class="mt-2">
            <v-col cols="12" sm="6">
              <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">
                Área (Hectáreas) *
              </label>
              <v-text-field
                v-model.number="form.area"
                variant="outlined"
                density="compact"
                type="number"
                hide-details
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">
                Tipo Área *
              </label>
              <v-select
                v-model="form.tipoArea"
                :items="['Cultivo', 'Pastizal', 'Bosque', 'Invernadero']"
                variant="outlined"
                density="compact"
                hide-details
                required
              ></v-select>
            </v-col>
          </v-row>

          <!-- Dirección (Mapa) -->
          <div class="mt-6 mb-4">
            <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">
              Ubicación Geográfica de la Parcela *
            </label>
            <v-card flat class="border rounded-lg overflow-hidden mb-3" height="300">
              <l-map :zoom="mapZoom" :center="mapCenter" style="height: 100%; width: 100%" @click="onMapClick">
                <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base" name="OpenStreetMap"></l-tile-layer>
                <l-marker v-if="form.direccion.latitud" :lat-lng="[form.direccion.latitud, form.direccion.longitud]"></l-marker>
              </l-map>
            </v-card>
            
            <v-row dense>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="form.direccion.latitud"
                  label="Latitud"
                  variant="outlined"
                  density="compact"
                  type="number"
                  hide-details
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="form.direccion.longitud"
                  label="Longitud"
                  variant="outlined"
                  density="compact"
                  type="number"
                  hide-details
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="form.direccion.altitud"
                  label="Altitud (m)"
                  variant="outlined"
                  density="compact"
                  type="number"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="form.direccion.calles"
                  label="Calles / Accesos"
                  variant="outlined"
                  density="compact"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="form.direccion.referencia"
                  label="Referencia"
                  variant="outlined"
                  density="compact"
                  rows="2"
                  hide-details
                  placeholder="Detalles para ubicar el agroecosistema"
                ></v-textarea>
              </v-col>
            </v-row>
          </div>

          <!-- Subsección: Alimentos y Plantas -->
          <v-row class="mt-4 mb-2">
            <v-col cols="12" md="6">
              <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">
                Alimentos
              </label>
              <v-combobox
                v-model="form.productos"
                :items="alimentosDisponibles"
                variant="outlined"
                density="compact"
                multiple
                chips
                closable-chips
                :loading="loading"
                placeholder="Seleccionar alimentos"
                hide-details
              ></v-combobox>
            </v-col>
            <v-col cols="12" md="6">
              <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">
                Plantas Medicinales
              </label>
              <v-combobox
                v-model="form.plantas"
                :items="plantasDisponibles"
                variant="outlined"
                density="compact"
                multiple
                chips
                closable-chips
                :loading="loading"
                placeholder="Seleccionar plantas"
                hide-details
              ></v-combobox>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { dbService } from '@/services/db.service'
import { getAlimentos, getPlantas } from '@/services/apiService'

const route = useRoute()
import 'leaflet/dist/leaflet.css'
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet'

const formValido = ref(false)
const mapCenter = ref([-2.900128, -79.005896])
const mapZoom = ref(14)

const form = ref({
  id: '',
  idProductor: '',
  area: null as number | null,
  tipoArea: null as string | null,
  direccion: {
    latitud: null as number | null,
    longitud: null as number | null,
    altitud: null as number | null,
    referencia: '',
    calles: ''
  },
  productos: [] as string[],
  plantas: [] as string[]
})

const loading = ref(false)
const alimentosDisponibles = ref<string[]>([])
const plantasDisponibles = ref<string[]>([])

const onMapClick = async (e: any) => {
  if (e && e.latlng) {
    const lat = e.latlng.lat
    const lng = e.latlng.lng
    form.value.direccion.latitud = parseFloat(lat.toFixed(6))
    form.value.direccion.longitud = parseFloat(lng.toFixed(6))

    try {
      const response = await fetch(`https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lng}`)
      if (response.ok) {
        const data = await response.json()
        if (data.elevation && data.elevation.length > 0) {
          form.value.direccion.altitud = parseFloat(data.elevation[0].toFixed(2))
        }
      }
    } catch (error) {
      console.error('Error fetching elevation:', error)
    }
  }
}

onMounted(async () => {
  const idProductor = String(route.params.id) // Route is /productores/:id/agroecosistema/editar
  form.value.idProductor = idProductor

  loading.value = true
  try {
    const [alimentos, plantas] = await Promise.all([
      getAlimentos(),
      getPlantas()
    ])
    alimentosDisponibles.value = alimentos.map((item: any) => item.nombre || item) // Depending on the JSON structure
    plantasDisponibles.value = plantas.map((item: any) => item.nombre || item)
  } catch (err) {
    console.error("Error fetching api data:", err)
  } finally {
    loading.value = false
  }

  const agroData = await dbService.getAgroecosistemaByProductor(idProductor)
  if (agroData) {
    form.value.id = agroData.idAgroecosistema
    form.value.area = agroData.area // now it's a number from M2
    form.value.tipoArea = agroData.tipoArea
    form.value.productos = agroData.productos || []
    form.value.plantas = agroData.plantas || []
    form.value.direccion.latitud = agroData.direccion.latitud
    form.value.direccion.longitud = agroData.direccion.longitud
    form.value.direccion.altitud = agroData.direccion.altitud
    form.value.direccion.referencia = agroData.direccion.referencia
    form.value.direccion.calles = agroData.direccion.calles

    if (agroData.direccion.latitud && agroData.direccion.longitud) {
      mapCenter.value = [agroData.direccion.latitud, agroData.direccion.longitud]
    }
  } else {
    // New agroecosistema fallback ID
    form.value.id = 'AGR-' + Math.floor(Math.random() * 10000).toString()
  }
})

const guardar = () => {
  console.log('Guardando Agroecosistema:', form.value)
}
</script>
