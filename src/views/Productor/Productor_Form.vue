<template>
  <v-container fluid class="pa-6">
    <!-- Encabezado con Navegación -->
    <div class="d-flex align-center mb-6">
      <v-btn icon="mdi-arrow-left" variant="text" @click="$router.back()"></v-btn>
      <div>
        <h1 class="text-h5 font-weight-bold ms-2">Formulario del Productor</h1>
        <div class="text-subtitle-2 text-grey ms-2">Ingresa o actualiza la información del productor</div>
      </div>
    </div>

    <!-- Formulario Principal -->
    <v-form @submit.prevent="submitForm">
      <v-row>
        <!-- Columna Izquierda: Datos Personales -->
        <v-col cols="12" md="8">
          <v-card flat class="border rounded-lg mb-6">
            <v-card-title class="bg-grey-lighten-4 py-3 text-subtitle-1 font-weight-bold d-flex align-center">
              <v-icon color="primary" class="me-2">mdi-account-details</v-icon>
              Datos Personales
            </v-card-title>
            <v-divider></v-divider>
            
            <v-card-text class="pa-5">
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="formData.nombres"
                    label="Nombres"
                    variant="outlined"
                    density="comfortable"
                    placeholder="Ej. Juan Pablo"
                    prepend-inner-icon="mdi-account"
                    :rules="[v => !!v || 'Campo requerido']"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="formData.apellidos"
                    label="Apellidos"
                    variant="outlined"
                    density="comfortable"
                    placeholder="Ej. Perez Salto"
                    :rules="[v => !!v || 'Campo requerido']"
                    required
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="formData.cedula"
                    label="Cédula"
                    variant="outlined"
                    density="comfortable"
                    placeholder="Ej. 0102030405"
                    prepend-inner-icon="mdi-card-account-details-outline"
                    :rules="[v => !!v || 'Campo requerido']"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="formData.contacto"
                    label="Contacto (Teléfono)"
                    variant="outlined"
                    density="comfortable"
                    placeholder="Ej. 0999999999"
                    prepend-inner-icon="mdi-phone"
                    :rules="[v => !!v || 'Campo requerido']"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="formData.email"
                    label="Correo Electrónico"
                    variant="outlined"
                    density="comfortable"
                    placeholder="ejemplo@correo.com"
                    prepend-inner-icon="mdi-email"
                    type="email"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card flat class="border rounded-lg">
            <v-card-title class="bg-grey-lighten-4 py-3 text-subtitle-1 font-weight-bold d-flex align-center">
              <v-icon color="primary" class="me-2">mdi-briefcase</v-icon>
              Información Agropecuaria
            </v-card-title>
            <v-divider></v-divider>
            
            <v-card-text class="pa-5">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.actividadEconomica"
                    label="Actividad Económica"
                    variant="outlined"
                    density="comfortable"
                    placeholder="Ej. Agroproductor, Ganadero"
                    prepend-inner-icon="mdi-sprout"
                    :rules="[v => !!v || 'Campo requerido']"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Columna Derecha: Configuración Técnica -->
        <v-col cols="12" md="4">
          <v-card flat class="border rounded-lg mb-6">
            <v-card-title class="bg-grey-lighten-4 py-3 text-subtitle-1 font-weight-bold d-flex align-center">
              <v-icon color="teal" class="me-2">mdi-certificate-outline</v-icon>
              Certificaciones
            </v-card-title>
            <v-divider></v-divider>
            
            <v-card-text class="pa-5">


              <v-btn
                block
                color="primary"
                variant="tonal"
                prepend-icon="mdi-certificate-outline"
                class="mb-3 text-none"
                @click="dialogAval = true"
              >
                Gestionar Aval
              </v-btn>

              <v-btn
                block
                color="success"
                variant="tonal"
                prepend-icon="mdi-leaf"
                class="text-none"
                @click="dialogAgro = true"
              >
                Gestionar Agroecosistema
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <!-- Fila Inferior: Mapa y Coordenadas -->
        <v-col cols="12">
          <v-card flat class="border rounded-lg mb-6">
            <v-card-title class="bg-grey-lighten-4 py-3 text-subtitle-1 font-weight-bold d-flex align-center">
              <v-icon color="teal" class="me-2">mdi-map</v-icon>
              Ubicación Geográfica (Dirección) *
            </v-card-title>
            <v-divider></v-divider>
            
            <v-card-text class="pa-5">
              <v-card flat class="border rounded-lg overflow-hidden mb-3" height="400">
                <l-map :zoom="mapZoom" :center="mapCenter" style="height: 100%; width: 100%" @click="onMapClick">
                  <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base" name="OpenStreetMap"></l-tile-layer>
                  <l-marker v-if="formData.direccion.latitud" :lat-lng="[formData.direccion.latitud, formData.direccion.longitud]"></l-marker>
                </l-map>
              </v-card>
              
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="formData.direccion.latitud"
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
                    v-model.number="formData.direccion.longitud"
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
                    v-model.number="formData.direccion.altitud"
                    label="Altitud (m)"
                    variant="outlined"
                    density="compact"
                    type="number"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="8">
                  <v-text-field
                    v-model="formData.direccion.calles"
                    label="Calles (Ej. Bolívar y Tarqui)"
                    variant="outlined"
                    density="compact"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="formData.direccion.referencia"
                    label="Referencia"
                    variant="outlined"
                    density="compact"
                    rows="2"
                    hide-details
                    placeholder="Detalles para encontrar el lugar"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Acciones -->
          <v-card flat class="bg-transparent">
            <v-row density="compact">
              <v-col cols="6">
                <v-btn 
                  block 
                  size="large" 
                  variant="outlined" 
                  color="grey-darken-1"
                  class="text-none font-weight-bold"
                  @click="$router.back()"
                >
                  Cancelar
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn 
                  block 
                  size="large" 
                  color="primary"
                  type="submit"
                  class="text-none font-weight-bold"
                  prepend-icon="mdi-content-save"
                >
                  Guardar
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-form>

    <!-- Dialogs para Aval y Agroecosistema -->
    <AvalFormDialog v-model="dialogAval" @save="onAvalSaved" />
    <AgroecosistemaFormDialog v-model="dialogAgro" @save="onAgroSaved" />
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import 'leaflet/dist/leaflet.css'
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet'
import AvalFormDialog from '@/components/AvalFormDialog.vue'
import AgroecosistemaFormDialog from '@/components/AgroecosistemaFormDialog.vue'

const mapCenter = ref([-2.900128, -79.005896]) // Default Cuenca, Ecuador
const mapZoom = ref(13)

const dialogAval = ref(false)
const dialogAgro = ref(false)

const onAvalSaved = (data: any) => {
  console.log('Aval guardado:', data)
  // Optionally store data in formData or re-fetch
}

const onAgroSaved = (data: any) => {
  console.log('Agroecosistema guardado:', data)
  // Optionally store data in formData or re-fetch
}

const formData = ref({
  nombres: '',
  apellidos: '',
  cedula: '',
  contacto: '',
  email: '',
  actividadEconomica: '',
  direccion: {
    latitud: null as number | null,
    longitud: null as number | null,
    altitud: null as number | null,
    referencia: '',
    calles: ''
  },
  aval: null,
  agroecosistema: null
})

const onMapClick = async (e: any) => {
  if (e && e.latlng) {
    const lat = e.latlng.lat
    const lng = e.latlng.lng
    formData.value.direccion.latitud = parseFloat(lat.toFixed(6))
    formData.value.direccion.longitud = parseFloat(lng.toFixed(6))

    try {
      const response = await fetch(`https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lng}`)
      if (response.ok) {
        const data = await response.json()
        if (data.elevation && data.elevation.length > 0) {
          formData.value.direccion.altitud = parseFloat(data.elevation[0].toFixed(2))
        }
      }
    } catch (error) {
      console.error('Error fetching elevation:', error)
    }
  }
}

const submitForm = () => {
  // Lógica de guardado
  console.log('Formulario enviado:', formData.value)
}
</script>