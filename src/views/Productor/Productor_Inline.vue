<template>
  <v-container fluid class="pa-6">
    <v-row>
      <v-col cols="12" md="3" lg="2">
        <v-card flat class="pa-2 rounded-lg">
          <v-list density="compact" nav>
            <v-list-item
              v-for="provincia in provincias"
              :key="provincia"
              :active="selectedProvincia === provincia"
              @click="selectedProvincia = provincia"
              color="primary"
              rounded="lg"
            >
              <v-list-item-title>{{ provincia }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <v-col cols="12" md="9" lg="10">
        <div class="d-flex align-center justify-space-between mb-4">
          <h1 class="text-h5 font-weight-medium">Productor</h1>
          <v-btn color="primary" prepend-icon="mdi-plus" class="text-none" @click="$router.push('/productores/nuevo')">
            Add
          </v-btn>
        </div>

        <v-row>
          <v-col
            v-for="p in filteredProductores"
            :key="p.id"
            cols="12"
            md="6"
          >
            <BaseCard
              @click="$router.push(`/productores/${p.id}`)"
              style="cursor: pointer"
              hover
              :nombre="p.nombre"
              :tipo="p.tipo || ''"
              :parroquia="p.parroquia || ''"
              :sector="p.sector || ''"
              :aval="p.aval"
              :cedula="p.cedula"
              :contacto="p.contacto"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import BaseCard from '@/components/BaseCard.vue'
import { dbService } from '@/services/db.service'
import type { Productor } from '@/types'

const search = ref('')
const selectedProvincia = ref('All')
const provincias = ref<string[]>([])
const productores = ref<Productor[]>([])

onMounted(async () => {
  provincias.value = await dbService.getProvincias()
  productores.value = await dbService.getProductores()
})

const filteredProductores = computed(() => {
  return productores.value.filter(p => {
    const matchesProvincia = selectedProvincia.value === 'All' || p.provincia === selectedProvincia.value
    const matchesSearch = p.nombre.toLowerCase().includes(search.value.toLowerCase()) ||
                          (p.parroquia || '').toLowerCase().includes(search.value.toLowerCase())
    return matchesProvincia && matchesSearch
  })
})
</script>
