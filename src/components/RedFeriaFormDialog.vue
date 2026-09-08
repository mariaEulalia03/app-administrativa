<template>
  <v-dialog v-model="dialog" max-width="500px" persistent scrollable>
    <v-card class="rounded-lg">
      <!-- Encabezado del Formulario -->
      <v-card-title class="d-flex align-center justify-space-between pa-4 border-b">
        <div class="d-flex align-center">
          <v-btn icon="mdi-close" variant="text" size="small" @click="cerrar"></v-btn>
          <span class="text-h6 font-weight-bold ms-2">RedFeria Form</span>
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
          
          <!-- IdRedFeria -->
          <div class="mb-4">
            <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">
              IdRedFeria *
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

          <!-- IdRed -->
          <div class="mb-4">
            <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">
              IdRed
            </label>
            <v-autocomplete
              v-model="form.idRed"
              :items="redesList"
              item-title="nombre"
              item-value="id"
              placeholder="Search Red"
              variant="outlined"
              density="compact"
              hide-details
              :readonly="fixedRed"
              :bg-color="fixedRed ? 'grey-lighten-4' : undefined"
            >
              <template v-slot:prepend-item>
                <v-list-item @click="irCrearRed" class="text-primary font-weight-bold">
                  <template v-slot:prepend>
                    <v-icon color="primary" class="me-2">mdi-pencil</v-icon>
                  </template>
                  <v-list-item-title>New</v-list-item-title>
                </v-list-item>
                <v-divider class="mb-2"></v-divider>
              </template>
            </v-autocomplete>
          </div>

          <!-- IdFeria -->
          <div class="mb-2">
            <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">
              IdFeria
            </label>
            <v-autocomplete
              v-model="form.idFeria"
              :items="feriasList"
              item-title="nombre"
              item-value="id"
              placeholder="Search Feria"
              variant="outlined"
              density="compact"
              hide-details
              :readonly="fixedFeria"
              :bg-color="fixedFeria ? 'grey-lighten-4' : undefined"
            >
              <template v-slot:prepend-item>
                <v-list-item @click="irCrearFeria" class="text-primary font-weight-bold">
                  <template v-slot:prepend>
                    <v-icon color="primary" class="me-2">mdi-pencil</v-icon>
                  </template>
                  <v-list-item-title>New</v-list-item-title>
                </v-list-item>
                <v-divider class="mb-2"></v-divider>
              </template>
            </v-autocomplete>
          </div>

        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { dbService } from '@/services/db.service'

const props = defineProps({
  modelValue: Boolean,
  prefilledIdRed: { type: String, default: null },
  prefilledIdFeria: { type: String, default: null }
})

const emit = defineEmits(['update:modelValue', 'save'])

const router = useRouter()
const dialog = ref(props.modelValue)
const formValido = ref(false)

const redesList = ref([])
const feriasList = ref([])

const fixedRed = ref(false)
const fixedFeria = ref(false)

const form = ref({
  id: 'd91345f1',
  idRed: null,
  idFeria: null
})

onMounted(async () => {
  redesList.value = await dbService.getRedes()
  feriasList.value = await dbService.getFerias()
})

watch(() => props.modelValue, (val) => {
  dialog.value = val
  if (val) {
    form.value.id = Math.random().toString(16).slice(2, 10)
    
    if (props.prefilledIdRed) {
      form.value.idRed = props.prefilledIdRed
      fixedRed.value = true
    } else {
      form.value.idRed = null
      fixedRed.value = false
    }

    if (props.prefilledIdFeria) {
      form.value.idFeria = props.prefilledIdFeria
      fixedFeria.value = true
    } else {
      form.value.idFeria = null
      fixedFeria.value = false
    }
  }
})

watch(dialog, (val) => {
  emit('update:modelValue', val)
})

const cerrar = () => {
  dialog.value = false
}

const guardar = () => {
  emit('save', { ...form.value })
  cerrar()
}

const irCrearRed = () => {
  cerrar()
  router.push('/redes/nuevo')
}

const irCrearFeria = () => {
  cerrar()
  router.push('/ferias/nuevo')
}
</script>
