<template>
  <v-dialog v-model="dialog" max-width="600px" persistent scrollable>
    <v-card class="rounded-lg">
      <!-- Encabezado del Formulario -->
      <v-card-title class="d-flex align-center justify-space-between pa-4 border-b">
        <div class="d-flex align-center">
          <v-btn icon="mdi-close" variant="text" size="small" @click="cerrar"></v-btn>
          <span class="text-h6 font-weight-bold ms-2">Formulario del Agroecosistema</span>
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
          
          <!-- ID Agroecosistema -->
          <div class="mb-4">
            <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">
              ID Agroecosistema *
            </label>
            <v-text-field
              v-model="form.id"
              variant="outlined"
              density="compact"
              hide-details
              required
            ></v-text-field>
          </div>

          <!-- ID Productor -->
          <div class="mb-4">
            <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">
              ID Productor
            </label>
            <v-select
              v-model="form.idProductor"
              :items="productoresDisponibles"
              placeholder="Selecciona el productor"
              variant="outlined"
              density="compact"
              hide-details
            ></v-select>
          </div>

          <!-- ID Dirección -->
          <div class="mb-4">
            <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">
              ID Dirección
            </label>
            <v-select
              v-model="form.idDireccion"
              :items="['1', '2', '3', '4']"
              placeholder="Selecciona la dirección"
              variant="outlined"
              density="compact"
              hide-details
            ></v-select>
          </div>

          <!-- Área -->
          <div class="mb-4">
            <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">
              Área *
            </label>
            <v-text-field
              v-model.number="form.area"
              type="number"
              variant="outlined"
              density="compact"
              hide-details
            >
              <template v-slot:append-inner>
                <v-btn icon="mdi-minus" size="x-small" variant="text" @click="form.area = Math.max(0, form.area - 1)"></v-btn>
                <v-btn icon="mdi-plus" size="x-small" variant="text" @click="form.area++"></v-btn>
              </template>
            </v-text-field>
          </div>

          <!-- Tipo Área -->
          <div class="mb-4">
            <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">
              Tipo Área
            </label>
            <v-select
              v-model="form.tipoArea"
              :items="['Arrendada', 'Propia', 'Comunitaria', 'Prestada']"
              placeholder="Selecciona tipo de área"
              variant="outlined"
              density="compact"
              hide-details
            ></v-select>
          </div>

          <!-- Productos -->
          <div class="mb-4">
            <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">
              Productos
            </label>
            <v-autocomplete
              v-model="form.productos"
              :items="productosDisponibles"
              multiple
              chips
              closable-chips
              variant="outlined"
              density="compact"
              hide-details
              placeholder="Selecciona o añade productos"
            ></v-autocomplete>
          </div>

          <!-- Subsección: Plantas -->
          <div class="mb-2">
            <div class="d-flex align-center justify-space-between mb-2">
              <label class="text-caption font-weight-bold text-grey-darken-1">Plantas</label>
              <v-btn size="small" variant="text" color="primary" class="text-none" @click="agregarPlanta">
                New
              </v-btn>
            </div>
            <v-card flat class="border rounded-lg pa-3 bg-grey-lighten-5">
              <div v-if="form.plantas.length === 0" class="text-caption text-grey text-center py-2">
                No hay plantas registradas
              </div>
              <v-chip
                v-for="(planta, index) in form.plantas"
                :key="index"
                class="me-2 mb-2"
                closable
                @click:close="form.plantas.splice(index, 1)"
              >
                {{ planta }}
              </v-chip>
            </v-card>
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
  id: '1',
  idProductor: 'María Manuela Guncay León',
  idDireccion: '1',
  area: 4757,
  tipoArea: 'Arrendada',
  productos: ['Costilla de cerdo'],
  plantas: []
})

const productoresDisponibles = [
  'María Manuela Guncay León',
  'Rosa Blanca Illescas Quichimbo',
  'Claudia Verónica Rivera Flores'
]

const productosDisponibles = [
  'Costilla de cerdo',
  'Huevo de gallina',
  'Manteca de cerdo',
  'Miel de abeja',
  'Hortalizas varias'
]

const agregarPlanta = () => {
  form.value.plantas.push(`Planta / Cultivo ${form.value.plantas.length + 1}`)
}

const cerrar = () => {
  dialog.value = false
}

const guardar = () => {
  emit('save', { ...form.value })
  cerrar()
}
</script>
