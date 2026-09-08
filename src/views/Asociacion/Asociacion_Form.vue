<template>
  <v-container fluid class="pa-6" style="max-width: 800px;">
    <v-card class="rounded-lg border" flat>
      <!-- Encabezado del Formulario -->
      <v-card-title class="d-flex align-center justify-space-between pa-4 border-b bg-grey-lighten-4">
        <div class="d-flex align-center">
          <v-btn icon="mdi-arrow-left" variant="text" size="small" @click="$router.back()"></v-btn>
          <span class="text-h6 font-weight-bold ms-2">Formulario de Asociación</span>
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
          
          <!-- ID Asociación -->
          <div class="mb-4">
            <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">
              ID Asociacion *
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
              placeholder="Escribe el nombre de la asociación"
              variant="outlined"
              density="compact"
              hide-details
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
                <v-icon size="36" color="teal-darken-3">mdi-account-group</v-icon>
              </v-avatar>
              <div>
                <v-btn size="small" variant="text" color="primary" prepend-icon="mdi-camera">
                  Cambiar Ícono
                </v-btn>
              </div>
            </v-card>
          </div>

          <!-- Subsección: Redes -->
          <div class="mb-4">
            <div class="d-flex align-center justify-space-between mb-2">
              <label class="text-caption font-weight-bold text-grey-darken-1">Redes</label>
              <v-btn size="small" variant="tonal" color="primary" prepend-icon="mdi-plus" @click="agregarRed">
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



        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const formValido = ref(false)

const form = ref({
  id: '0c725567',
  nombre: '',
  icono: '',
  redes: [] as string[]
})



const agregarRed = () => {
  form.value.redes.push(`Red ${form.value.redes.length + 1}`)
}

const guardar = () => {
  console.log('Guardando...', form.value)
  // emit('save', { ...form.value })
  // router.back() // Aquí iría la redirección después de guardar exitosamente
}
</script>
