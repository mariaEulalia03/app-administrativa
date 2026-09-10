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
          <div class="mb-4">
            <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">
              Plantas
            </label>
            <v-autocomplete
              v-model="form.plantas"
              :items="plantasDisponibles"
              multiple
              chips
              closable-chips
              variant="outlined"
              density="compact"
              hide-details
              placeholder="Selecciona o añade plantas"
            ></v-autocomplete>
          </div>

        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { getAlimentos, getPlantas } from '@/services/apiService'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue', 'save'])

const dialog = ref(props.modelValue)
const formValido = ref(false)
const loading = ref(false)

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
  productos: [],
  plantas: []
})

const productoresDisponibles = [
  'María Manuela Guncay León',
  'Rosa Blanca Illescas Quichimbo',
  'Claudia Verónica Rivera Flores'
]

const productosDisponibles = ref([])
const plantasDisponibles = ref([])

onMounted(async () => {
  loading.value = true
  try {
    const [alimentos, plantas] = await Promise.all([
      getAlimentos(),
      getPlantas()
    ])
    productosDisponibles.value = alimentos.map((item) => item.nombre || item)
    plantasDisponibles.value = plantas.map((item) => item.nombre || item)
  } catch (error) {
    console.error("Error al cargar datos:", error)
  } finally {
    loading.value = false
  }
})

const cerrar = () => {
  dialog.value = false
}

const guardar = () => {
  emit('save', { ...form.value })
  cerrar()
}
</script>
