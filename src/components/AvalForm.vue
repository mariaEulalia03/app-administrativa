<template>
  <v-card class="rounded-lg elevation-2">
    <v-card-title class="d-flex align-center justify-space-between pa-4 border-b">
      <span class="text-h6 font-weight-bold">Formulario del Aval</span>
      <div>
        <v-btn variant="text" class="me-2 text-none" @click="$emit('cancel')">Cancel</v-btn>
        <v-btn color="primary" class="text-none" :disabled="!formValido" @click="guardar">
          Save
        </v-btn>
      </div>
    </v-card-title>

    <v-card-text class="pa-6">
      <v-form ref="formRef" v-model="formValido">
        
        <div class="mb-4">
          <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">IdAval *</label>
          <v-text-field v-model="form.id" variant="outlined" density="compact" hide-details required></v-text-field>
        </div>

        <div class="mb-4">
          <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">IdEntidadControl</label>
          <v-select v-model="form.idEntidadControl" :items="entidades" placeholder="Selecciona la entidad" variant="outlined" density="compact" hide-details></v-select>
        </div>

        <div class="mb-4">
          <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">Nombre</label>
          <v-text-field v-model="form.nombre" placeholder="Ej. Permiso Funcionamiento" variant="outlined" density="compact" hide-details></v-text-field>
        </div>

        <div class="mb-4">
          <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">Estado</label>
          <v-btn-toggle v-model="form.estado" color="primary" mandatory variant="outlined" density="compact" class="w-100 d-flex">
            <v-btn value="Activa" class="flex-grow-1 text-none">Activa</v-btn>
            <v-btn value="Caducada" class="flex-grow-1 text-none">Caducada</v-btn>
            <v-btn value="Proceso" class="flex-grow-1 text-none">Proceso</v-btn>
          </v-btn-toggle>
        </div>

        <div class="mb-4">
          <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">FechaOtorga *</label>
          <v-text-field v-model="form.fechaOtorga" type="date" variant="outlined" density="compact" hide-details required></v-text-field>
        </div>

        <div class="mb-4">
          <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">FechaFinaliza *</label>
          <v-text-field v-model="form.fechaFinaliza" type="date" variant="outlined" density="compact" hide-details required></v-text-field>
        </div>

        <div class="mb-2">
          <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">id_productor</label>
          <v-select v-model="form.idProductor" :items="productores" placeholder="Selecciona el productor" variant="outlined" density="compact" hide-details></v-select>
        </div>

      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  aval: {
    type: Object,
    default: () => null
  }
})

const emit = defineEmits(['cancel', 'save'])
const formValido = ref(true)

const form = ref({
  id: '1',
  idEntidadControl: 'EDEC',
  nombre: 'Permiso Funcionamiento',
  estado: 'Activa',
  fechaOtorga: '2023-11-04',
  fechaFinaliza: '2024-11-04',
  idProductor: 'María Manuela Guncay León'
})

watch(() => props.aval, (newVal) => {
  if (newVal) {
    form.value = { ...newVal }
  }
}, { immediate: true })

const entidades = ['EDEC', 'MAG', 'GAD Municipal', 'Agrocalidad']
const productores = ['María Manuela Guncay León', 'Rosa Blanca Illescas Quichimbo', 'Claudia Verónica Rivera Flores']

const guardar = () => {
  emit('save', { ...form.value })
}
</script>
