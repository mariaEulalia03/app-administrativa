<template>
  <v-dialog v-model="dialog" max-width="500px" persistent scrollable>
    <v-card class="rounded-lg">
      <!-- Encabezado del Formulario -->
      <v-card-title class="d-flex align-center justify-space-between pa-4 border-b">
        <div class="d-flex align-center">
          <v-btn icon="mdi-close" variant="text" size="small" @click="cerrar"></v-btn>
          <span class="text-h6 font-weight-bold ms-2">Formulario del Horario</span>
        </div>
        <div>
          <v-btn variant="text" class="me-2 text-none" @click="cerrar">Cancel</v-btn>
          <v-btn color="primary" class="text-none" :disabled="!formValido" @click="guardar">
            Save
          </v-btn>
        </div>
      </v-card-title>

      <!-- Cuerpo del Formulario -->
      <v-card-text class="pa-6">
        <v-form ref="formRef" v-model="formValido">
          
          <!-- IdHorario -->
          <div class="mb-4">
            <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">
              IdHorario *
            </label>
            <v-text-field
              v-model="form.id"
              variant="outlined"
              density="compact"
              hide-details
              required
            ></v-text-field>
          </div>

          <!-- HoraApertura -->
          <div class="mb-4">
            <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">
              HoraApertura *
            </label>
            <v-text-field
              v-model="form.horaApertura"
              type="time"
              step="1"
              prepend-inner-icon="mdi-clock-outline"
              variant="outlined"
              density="compact"
              hide-details
              required
            ></v-text-field>
          </div>

          <!-- HoraCierre -->
          <div class="mb-4">
            <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">
              HoraCierre *
            </label>
            <v-text-field
              v-model="form.horaCierre"
              type="time"
              step="1"
              prepend-inner-icon="mdi-clock-outline"
              variant="outlined"
              density="compact"
              hide-details
              required
            ></v-text-field>
          </div>

          <!-- Dia -->
          <div class="mb-4">
            <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">
              Día(s)
            </label>
            <v-select
              v-model="form.dias"
              :items="diasSemana"
              placeholder="Selecciona uno o más días"
              variant="outlined"
              density="compact"
              multiple
              chips
              closable-chips
              hide-details
            ></v-select>
          </div>

          <!-- id_feria -->
          <div class="mb-2">
            <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">
              id_feria
            </label>
            <v-select
              v-model="form.idFeria"
              :items="feriasDisponibles"
              placeholder="Selecciona la feria"
              variant="outlined"
              density="compact"
              hide-details
            ></v-select>
          </div>

        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue', 'save'])

const dialog = ref(props.modelValue)
const formValido = ref(false)

watch(() => props.modelValue, (val) => {
  dialog.value = val
})

watch(dialog, (val) => {
  emit('update:modelValue', val)
})

const form = ref({
  id: '6b9f9dc9',
  horaApertura: '17:21:49',
  horaCierre: '17:21:49',
  dias: [],
  idFeria: 'FA-01'
})

const diasSemana = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo'
]

const feriasDisponibles = [
  'FA-01',
  'FA-02',
  'FA-03'
]

const cerrar = () => {
  dialog.value = false
}

const guardar = () => {
  emit('save', { ...form.value })
  cerrar()
}
</script>
