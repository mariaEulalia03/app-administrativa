<template>
  <v-container fluid class="pa-6" style="max-width: 800px;">
    <v-card class="rounded-lg border" flat>
      <!-- Encabezado del Formulario -->
      <v-card-title class="d-flex align-center justify-space-between pa-4 border-b bg-grey-lighten-4">
        <div class="d-flex align-center">
          <v-btn icon="mdi-arrow-left" variant="text" size="small" @click="$router.back()"></v-btn>
          <span class="text-h6 font-weight-bold ms-2">{{ isEditing ? 'Editar Red' : 'Nueva Red' }}</span>
        </div>
        <div>
          <v-btn variant="text" class="me-2 text-none" @click="$router.back()">Cancelar</v-btn>
          <v-btn color="primary" class="text-none" :disabled="!formValido || guardando" :loading="guardando" @click="guardar">
            Guardar
          </v-btn>
        </div>
      </v-card-title>

      <!-- Cuerpo del Formulario -->
      <v-card-text class="pa-6">
        <v-form ref="formRef" v-model="formValido">
          
          <!-- ID Red -->
          <div class="mb-4">
            <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">
              ID Red *
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
              Nombre de la Red *
            </label>
            <v-text-field
              v-model="form.nombre"
              placeholder="Escribe el nombre de la red"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :rules="[v => !!v || 'El nombre es obligatorio']"
            ></v-text-field>
          </div>

          <!-- Ícono -->
          <div class="mb-4">
            <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">
              Ícono
            </label>
            <v-card flat class="border rounded-lg pa-4 text-center bg-grey-lighten-5">
              <v-avatar size="64" color="teal-lighten-4" class="mb-2">
                <v-icon size="36" color="teal-darken-3">mdi-hub</v-icon>
              </v-avatar>
              <div>
                <v-btn size="small" variant="text" color="primary" prepend-icon="mdi-camera">
                  Cambiar Ícono
                </v-btn>
              </div>
            </v-card>
          </div>

          <!-- Subsección: Asociaciones -->
          <div class="mb-4">
            <div class="d-flex align-center justify-space-between mb-2">
              <label class="text-caption font-weight-bold text-grey-darken-1">Asociaciones Vinculadas</label>
            </div>
            <v-select
              v-model="form.asociaciones"
              :items="asociacionesDisponibles"
              item-title="nombre"
              item-value="id"
              multiple
              chips
              closable-chips
              placeholder="Seleccionar asociaciones"
              variant="outlined"
              density="compact"
            ></v-select>
          </div>

          <!-- Subsección: Ferias -->
          <div class="mb-2">
            <div class="d-flex align-center justify-space-between mb-2">
              <label class="text-caption font-weight-bold text-grey-darken-1">Ferias Vinculadas</label>
            </div>
            <v-select
              v-model="form.ferias"
              :items="feriasDisponibles"
              item-title="nombre"
              item-value="id"
              multiple
              chips
              closable-chips
              placeholder="Seleccionar ferias"
              variant="outlined"
              density="compact"
            ></v-select>
          </div>

        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { dbService } from '@/services/db.service'

const route = useRoute()
const router = useRouter()

const formRef = ref<any>(null)
const formValido = ref(true)
const guardando = ref(false)
const asociacionesDisponibles = ref<any[]>([])
const feriasDisponibles = ref<any[]>([])

const isEditing = computed(() => !!route.params.id)

const form = ref({
  id: '',
  nombre: '',
  icono: 'mdi-hub',
  asociaciones: [] as string[],
  ferias: [] as string[]
})

onMounted(async () => {
  const [asocs, fers] = await Promise.all([
    dbService.getAsociaciones(),
    dbService.getFerias()
  ])
  asociacionesDisponibles.value = asocs || []
  feriasDisponibles.value = fers || []

  const idParam = route.params.id as string
  if (idParam) {
    const data = await dbService.getRedById(idParam)
    if (data) {
      form.value.id = data.id
      form.value.nombre = data.nombre
      if (Array.isArray(data.asociaciones)) {
        form.value.asociaciones = data.asociaciones.map((a: any) => a.idAsociacion || a.id || a)
      }
      if (Array.isArray(data.ferias)) {
        form.value.ferias = data.ferias.map((f: any) => f.idFeria || f.id || f)
      }
    } else {
      form.value.id = idParam
    }
  } else {
    form.value.id = `RED-${Math.floor(10 + Math.random() * 90)}`
  }

  await nextTick()
  if (formRef.value) {
    formRef.value.validate()
  }
})

const guardar = async () => {
  if (formRef.value) {
    const { valid } = await formRef.value.validate()
    if (!valid) return
  }
  guardando.value = true
  try {
    await dbService.saveRed(form.value)
    router.back()
  } catch (error) {
    console.error('Error al guardar la red:', error)
  } finally {
    guardando.value = false
  }
}
</script>
