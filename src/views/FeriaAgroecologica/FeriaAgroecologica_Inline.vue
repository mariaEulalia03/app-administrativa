<template>
  <v-container fluid class="pa-6">
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="text-h5 font-weight-bold">Ferias Agroecológicas</h1>
        <p class="text-body-2 text-grey">Puntos de comercialización y ferias agroecológicas</p>
      </div>
      <v-btn color="teal-darken-3" prepend-icon="mdi-plus" class="text-none" @click="$router.push('/ferias/nuevo')">
        Add
      </v-btn>
    </div>

    <v-row>
      <v-col
        v-for="f in ferias"
        :key="f.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card
          flat
          class="border rounded-lg overflow-hidden h-100 d-flex flex-column justify-space-between"
          hover
          @click="$router.push(`/ferias/${f.id}`)"
        >
          <v-img
            :src="f.foto"
            height="180"
            cover
            class="bg-grey-lighten-2"
          >
            <template #placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-icon color="grey-lighten-1" size="48">mdi-storefront</v-icon>
              </div>
            </template>
          </v-img>

          <v-card-text class="pa-4 flex-grow-1">
            <div class="text-subtitle-1 font-weight-bold mb-1 text-teal-darken-4">
              {{ f.nombre }}
            </div>
            <div class="d-flex align-center text-caption text-grey-darken-1 mb-2">
              <v-icon size="small" class="me-1" color="teal">mdi-map-marker</v-icon>
              <span>{{ f.direccion }}</span>
            </div>
            <v-chip size="x-small" color="teal-lighten-4" class="text-teal-darken-4 font-weight-medium">
              ID: {{ f.id }}
            </v-chip>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { dbService } from '@/services/db.service'
import type { Feria } from '@/types'

const ferias = ref<Feria[]>([])

onMounted(async () => {
  ferias.value = await dbService.getFerias()
})
</script>

