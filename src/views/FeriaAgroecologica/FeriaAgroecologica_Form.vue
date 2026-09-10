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
            <DireccionForm
              v-model="form.direccion"
              title="Ubicación Geográfica *"
              :map-height="300"
            />
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
            </div>
            <v-autocomplete
              v-model="form.redes"
              :items="redesDisponibles"
              item-title="nombre"
              item-value="id"
              multiple
              chips
              closable-chips
              placeholder="Selecciona las redes vinculadas"
              variant="outlined"
              density="compact"
              hide-details
              bg-color="white"
            ></v-autocomplete>
          </div>

          <!-- Subsección: Horarios -->
          <div class="mb-2">
            <div class="d-flex align-center justify-space-between mb-2">
              <label class="text-caption font-weight-bold text-grey-darken-1">Horarios</label>
              <v-btn size="small" variant="text" color="primary" class="text-none" @click="abrirDialogoHorario">
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

    <!-- Dialogo para Horarios -->
    <HorarioFormDialog
      v-model="dialogoHorario"
      @save="onGuardarHorario"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { dbService } from '@/services/db.service'
import type { Direccion, Red } from '@/types'
import DireccionForm from '@/components/DireccionForm.vue'
import HorarioFormDialog from '@/components/HorarioFormDialog.vue'

const route = useRoute()
const router = useRouter()
const formValido = ref(false)
const dialogoHorario = ref(false)
const redesDisponibles = ref<Red[]>([])

const form = ref({
  id: '',
  nombre: '',
  direccion: {
    latitud: null as number | null,
    longitud: null as number | null,
    altitud: null as number | null,
    referencia: '',
    calles: ''
  } as Direccion,
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

  redesDisponibles.value = await dbService.getRedes()
})

const abrirDialogoHorario = () => {
  dialogoHorario.value = true
}

const onGuardarHorario = (horarioData: any) => {
  const diasStr = horarioData.dias ? horarioData.dias.join(', ') : ''
  const str = `${diasStr} ${horarioData.horaApertura || ''} - ${horarioData.horaCierre || ''}`
  form.value.horarios.push(str.trim())
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

