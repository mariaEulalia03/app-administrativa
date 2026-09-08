<template>
  <v-container fluid class="pa-6">
    <div class="d-flex align-center justify-space-between mb-4">
      <h1 class="text-h5 font-weight-bold">Asociaciones</h1>
      <v-btn color="teal-darken-3" prepend-icon="mdi-plus" @click="$router.push('/asociaciones/nuevo')">Add</v-btn>
    </div>

    <v-row>
      <v-col v-for="aso in asociaciones" :key="aso.id" cols="12" sm="6" md="4">
        <v-card flat class="border rounded-lg pa-3" @click="$router.push(`/asociaciones/${aso.id}`)" hover>
          <div class="d-flex align-center">
            <v-avatar color="teal-lighten-4" size="48" class="me-3">
              <v-icon color="teal-darken-3">mdi-sitemap</v-icon>
            </v-avatar>
            <div class="text-subtitle-1 font-weight-bold">{{ aso.nombre }}</div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { dbService } from '@/services/db.service'
import type { Asociacion } from '@/types'

const asociaciones = ref<Asociacion[]>([
  { id: 1, nombre: 'Aso. Dizha La Dolorosa' },
  { id: 2, nombre: 'Aso. ASOPROAMI' },
  { id: 3, nombre: 'Aso. Virgen del Rosario' },
  { id: 4, nombre: 'Aso. Señor de Los Milagros' },
])

onMounted(async () => {
  const data = await dbService.getAsociaciones()
  if (data && data.length > 0) {
    asociaciones.value = data
  }
})
</script>
