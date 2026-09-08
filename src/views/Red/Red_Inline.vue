<template>
  <v-container fluid class="pa-6">
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="text-h5 font-weight-bold">Redes</h1>
        <p class="text-body-2 text-grey">Listado de redes agroecológicas y colectivos</p>
      </div>
      <v-btn color="teal-darken-3" prepend-icon="mdi-plus" class="text-none" @click="$router.push('/redes/nuevo')">
        Add
      </v-btn>
    </div>

    <v-row>
      <v-col
        v-for="r in redes"
        :key="r.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card
          flat
          class="border rounded-lg pa-4 h-100 d-flex flex-column justify-space-between"
          hover
          @click="$router.push(`/redes/${r.id}`)"
        >
          <div class="d-flex align-center">
            <v-avatar color="teal-lighten-4" size="52" class="me-3">
              <v-icon color="teal-darken-3" size="28">{{ r.icono || 'mdi-hub' }}</v-icon>
            </v-avatar>
            <div>
              <div class="text-subtitle-1 font-weight-bold">{{ r.nombre }}</div>
              <div class="text-caption text-grey">ID: {{ r.id }}</div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { dbService } from '@/services/db.service'
import type { Red } from '@/types'

const redes = ref<Red[]>([])

onMounted(async () => {
  redes.value = await dbService.getRedes()
})
</script>

