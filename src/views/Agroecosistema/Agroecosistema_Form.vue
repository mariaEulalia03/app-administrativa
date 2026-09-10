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
            <DireccionForm
              v-model="form.direccion"
              title="Ubicación Geográfica de la Parcela *"
              :map-height="300"
              calles-label="Calles / Accesos"
              referencia-placeholder="Detalles para ubicar el agroecosistema"
            />
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
import { useRoute, useRouter } from 'vue-router'
import { dbService } from '@/services/db.service'
import { getAlimentos, getPlantas } from '@/services/apiService'
import type { Direccion } from '@/types'
import DireccionForm from '@/components/DireccionForm.vue'

const route = useRoute()
const router = useRouter()

const formValido = ref(false)

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
  } as Direccion,
  productos: [] as string[],
  plantas: [] as string[]
})

const loading = ref(false)
const alimentosDisponibles = ref<string[]>([])
const plantasDisponibles = ref<string[]>([])

onMounted(async () => {
  const idProductor = String(route.params.id) // Route is /productores/:id/agroecosistema/editar
  form.value.idProductor = idProductor

  loading.value = true
  try {
    const [alimentos, plantas] = await Promise.all([
      getAlimentos(),
      getPlantas()
    ])
    alimentosDisponibles.value = alimentos.map((item: any) => item.nombre || item)
    plantasDisponibles.value = plantas.map((item: any) => item.nombre || item)
  } catch (err) {
    console.error("Error fetching api data:", err)
  } finally {
    loading.value = false
  }

  const agroData = await dbService.getAgroecosistemaByProductor(idProductor)
  if (agroData) {
    form.value.id = agroData.idAgroecosistema
    form.value.area = agroData.area
    form.value.tipoArea = agroData.tipoArea
    form.value.productos = agroData.productos || []
    form.value.plantas = agroData.plantas || []
    form.value.direccion = {
      latitud: agroData.direccion?.latitud ?? null,
      longitud: agroData.direccion?.longitud ?? null,
      altitud: agroData.direccion?.altitud ?? null,
      referencia: agroData.direccion?.referencia ?? '',
      calles: agroData.direccion?.calles ?? ''
    }
  } else {
    // New agroecosistema fallback ID
    form.value.id = 'AGR-' + Math.floor(Math.random() * 10000).toString()
  }
})

const guardar = async () => {
  try {
    await dbService.saveAgroecosistema(form.value)
    router.back()
  } catch (error) {
    console.error('Error al guardar el agroecosistema:', error)
  }
}
</script>

