<template>
  <v-container fluid class="pa-6" style="max-width: 800px;">
    <v-card class="rounded-lg border" flat>
      <!-- Encabezado del Formulario -->
      <v-card-title class="d-flex align-center justify-space-between pa-4 border-b bg-grey-lighten-4">
        <div class="d-flex align-center">
          <v-btn icon="mdi-arrow-left" variant="text" size="small" @click="$router.back()"></v-btn>
          <span class="text-h6 font-weight-bold ms-2">Formulario de Feria Agroecológica</span>
        </div>
        <div>
          <v-btn variant="text" class="me-2 text-none" @click="$router.back()">Cancel</v-btn>
          <v-btn color="primary" class="text-none" :disabled="!formValido" @click="guardar">
            Save
          </v-btn>
        </div>
      </v-card-title>

      <!-- Cuerpo del Formulario -->
      <v-card-text class="pa-6">
        <v-form ref="formRef" v-model="formValido">
          
          <!-- ID Feriaagroecológica -->
          <div class="mb-4">
            <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">
              ID Feriaagroecológica *
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
          </div>

          <!-- Nombre -->
          <div class="mb-4">
            <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">
              Nombre
            </label>
            <v-text-field
              v-model="form.nombre"
              placeholder="Escribe el nombre de la feria"
              variant="outlined"
              density="compact"
              hide-details
            ></v-text-field>
          </div>

          <!-- Dirección (Mapa) -->
          <div class="mb-4">
            <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">
              Ubicación Geográfica *
            </label>
            <v-card flat class="border rounded-lg overflow-hidden mb-3" height="300">
              <l-map :zoom="mapZoom" :center="(mapCenter as any)" style="height: 100%; width: 100%" @click="onMapClick">
                <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base" name="OpenStreetMap"></l-tile-layer>
                <l-marker v-if="form.direccion.latitud" :lat-lng="[form.direccion.latitud || 0, form.direccion.longitud || 0]"></l-marker>
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
                  label="Calles (Ej. Bolívar y Tarqui)"
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
                  placeholder="Detalles para encontrar el lugar"
                ></v-textarea>
              </v-col>
            </v-row>
          </div>

          <!-- Entidad de Control -->
          <div class="mb-4">
            <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">
              Entidad de Control
            </label>
            <v-text-field
              v-model="form.entidadControl"
              variant="outlined"
              density="compact"
              hide-details
              readonly
              bg-color="grey-lighten-4"
            ></v-text-field>
          </div>

          <!-- Imagen -->
          <div class="mb-4">
            <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">
              Imagen
            </label>
            <v-card flat class="border rounded-lg pa-6 text-center bg-grey-lighten-5">
              <v-icon size="36" color="grey-darken-1" class="mb-1">mdi-camera</v-icon>
            </v-card>
          </div>

          <!-- Subsección: Redes -->
          <div class="mb-4">
            <div class="d-flex align-center justify-space-between mb-2">
              <label class="text-caption font-weight-bold text-grey-darken-1">Redes</label>
              <v-btn size="small" variant="text" color="primary" class="text-none" @click="agregarRed">
                New
              </v-btn>
            </div>
            <v-card flat class="border rounded-lg pa-3 bg-grey-lighten-5">
              <div v-if="form.redes.length === 0" class="text-caption text-grey text-center py-2">
                No hay redes vinculadas
              </div>
              <v-chip
                v-for="(red, index) in form.redes"
                :key="index"
                class="me-2 mb-2"
                closable
                @click:close="form.redes.splice(index, 1)"
              >
                {{ red }}
              </v-chip>
            </v-card>
          </div>

          <!-- Subsección: Horarios -->
          <div class="mb-2">
            <div class="d-flex align-center justify-space-between mb-2">
              <label class="text-caption font-weight-bold text-grey-darken-1">Horarios</label>
              <v-btn size="small" variant="text" color="primary" class="text-none" @click="agregarHorario">
                New
              </v-btn>
            </div>
            <v-card flat class="border rounded-lg pa-3 bg-grey-lighten-5">
              <div v-if="form.horarios.length === 0" class="text-caption text-grey text-center py-2">
                No hay horarios agregados
              </div>
              <v-chip
                v-for="(horario, index) in form.horarios"
                :key="index"
                class="me-2 mb-2"
                closable
                @click:close="form.horarios.splice(index, 1)"
              >
                {{ horario }}
              </v-chip>
            </v-card>
          </div>

        </v-form>
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
const formValido = ref(false)

const mapCenter = ref([-2.900128, -79.005896])
const mapZoom = ref(13)

const form = ref({
  id: '',
  nombre: '',
  direccion: {
    latitud: null as number | null,
    longitud: null as number | null,
    altitud: null as number | null,
    referencia: '',
    calles: ''
  },
  entidadControl: 'EDEC',
  imagen: '',
  redes: [] as string[],
  horarios: [] as string[]
})

onMounted(async () => {
  const idParam = route.params.id as string
  if (idParam) {
    const data = await dbService.getFeriaById(idParam)
    if (data) {
      form.value.id = data.id
      form.value.nombre = data.nombre || ''
      if (data.calles) form.value.direccion.calles = data.calles
    }
  } else {
    form.value.id = `FERIA-${Math.floor(100 + Math.random() * 900)}`
  }
})

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

const agregarRed = () => {
  form.value.redes.push(`Red Agroecológica ${form.value.redes.length + 1}`)
}

const agregarHorario = () => {
  form.value.horarios.push(`Sábados 07:00 - 13:00`)
}

const guardar = async () => {
  try {
    await dbService.saveFeria(form.value)
    router.back()
  } catch (error) {
    console.error('Error al guardar la feria:', error)
  }
}
</script>
