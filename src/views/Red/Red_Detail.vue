<template>
  <v-container fluid class="pa-6">
    <!-- Encabezado de Navegación -->
    <div class="d-flex align-center justify-space-between mb-4 position-sticky" style="top: 64px; z-index: 10; background-color: #f5f5f5; padding-top: 16px; padding-bottom: 8px; margin-top: -16px;">
      <div class="d-flex align-center">
        <v-btn icon="mdi-arrow-left" variant="text" @click="$router.back()"></v-btn>
        <h1 class="text-h5 font-weight-bold ms-2">Detalle de la Red</h1>
      </div>
      <div>
        <v-btn icon="mdi-delete-outline" color="error" variant="text" class="me-2"></v-btn>
        <v-btn color="primary" prepend-icon="mdi-pencil" class="text-none" @click="$router.push(`/redes/${$route.params.id}/editar`)">Edit</v-btn>
      </div>
    </div>

    <!-- Información de la Red -->
    <v-card flat class="border rounded-lg pa-4 mb-6">
      <v-row align="center">
        <v-col cols="12" sm="3" md="2" class="text-center">
          <v-avatar size="80" color="teal-lighten-4">
            <v-icon size="40" color="teal-darken-3">mdi-hub</v-icon>
          </v-avatar>
        </v-col>
        <v-col cols="12" sm="9" md="10">
          <div class="text-caption text-grey">Nombre</div>
          <div class="text-h6 font-weight-bold mb-2">{{ red.nombre }}</div>

          <div class="text-caption text-grey">ID Red</div>
          <div class="text-body-1 font-weight-medium">{{ red.id }}</div>
        </v-col>
      </v-row>
    </v-card>

    <!-- Listas Relacionadas -->
    <v-expansion-panels v-model="panel" multiple>
      <!-- Asociaciones -->
      <v-expansion-panel elevation="0" class="border rounded-lg mb-4">
        <v-expansion-panel-title>
          <div class="d-flex align-center justify-space-between w-100 me-4">
            <span class="font-weight-bold text-subtitle-1">Asociaciones</span>
            <v-chip size="small" color="teal-darken-3">{{ red.asociaciones.length }}</v-chip>
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-data-iterator
            :items="red.asociaciones"
            :items-per-page="5"
          >
            <template v-slot:default="{ items }">
              <v-row>
                <v-col
                  v-for="item in items"
                  :key="item.raw.idRelacion"
                  cols="12"
                  sm="6"
                  md="4"
                >
                  <v-card 
                    variant="elevated" 
                    elevation="1" 
                    class="h-100 d-flex flex-column border"
                    hover
                    style="cursor: pointer"
                    @click="openAsociacionDialog(item.raw)"
                  >
                    <v-card-text class="pa-4 flex-grow-1">
                      <div class="d-flex justify-space-between align-start mb-3">
                        <div class="text-subtitle-1 font-weight-bold text-primary text-truncate pe-2">
                          {{ item.raw.asociacion }}
                        </div>
                        <v-chip size="x-small" color="grey-lighten-2" class="text-grey-darken-3 font-weight-bold">
                          {{ item.raw.idRelacion }}
                        </v-chip>
                      </div>

                    </v-card-text>
                    
                    <v-divider></v-divider>
                    
                    <v-card-actions class="bg-grey-lighten-5 px-4 py-2">
                      <span class="text-caption text-grey">Ver detalles completos</span>
                      <v-spacer></v-spacer>
                      <v-btn icon="mdi-arrow-right" variant="tonal" size="x-small" color="primary"></v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </template>
          </v-data-iterator>
          <div class="d-flex justify-end mt-2">
            <v-btn size="small" variant="text" color="primary" prepend-icon="mdi-plus" @click="dialogAsociaciones = true">Add</v-btn>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- Ferias -->
      <v-expansion-panel elevation="0" class="border rounded-lg">
        <v-expansion-panel-title>
          <div class="d-flex align-center justify-space-between w-100 me-4">
            <span class="font-weight-bold text-subtitle-1">Ferias</span>
            <v-chip size="small" color="teal-darken-3">{{ red.ferias.length }}</v-chip>
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-data-iterator
            :items="red.ferias"
            :items-per-page="5"
          >
            <template v-slot:default="{ items }">
              <v-row>
                <v-col
                  v-for="item in items"
                  :key="item.raw.idRelacion"
                  cols="12"
                  sm="6"
                  md="4"
                >
                  <v-card 
                    variant="elevated" 
                    elevation="1" 
                    class="h-100 d-flex flex-column border"
                    hover
                    style="cursor: pointer"
                    @click="openFeriaDialog(item.raw)"
                  >
                    <v-card-text class="pa-4 flex-grow-1">
                      <div class="d-flex justify-space-between align-start mb-3">
                        <div class="text-subtitle-1 font-weight-bold text-primary text-truncate pe-2">
                          {{ item.raw.feria }}
                        </div>
                        <v-chip size="x-small" color="grey-lighten-2" class="text-grey-darken-3 font-weight-bold">
                          {{ item.raw.idRelacion }}
                        </v-chip>
                      </div>

                    </v-card-text>
                    
                    <v-divider></v-divider>
                    
                    <v-card-actions class="bg-grey-lighten-5 px-4 py-2">
                      <span class="text-caption text-grey">Ver detalles completos</span>
                      <v-spacer></v-spacer>
                      <v-btn icon="mdi-arrow-right" variant="tonal" size="x-small" color="primary"></v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </template>
          </v-data-iterator>
          <div class="d-flex justify-end mt-2">
            <v-btn size="small" variant="text" color="primary" prepend-icon="mdi-plus" @click="dialogFerias = true">Add</v-btn>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <AsociacionRedFormDialog v-model="dialogAsociaciones" :prefilledIdRed="red.id" @save="onAsociacionGuardada" />
    <RedFeriaFormDialog v-model="dialogFerias" :prefilledIdRed="red.id" @save="onFeriaGuardada" />
  </v-container>

  <!-- Diálogo de Asociación -->
  <v-dialog v-model="asociacionDialog" max-width="700">
    <AsociacionDetailModal
      v-if="selectedAsociacion"
      :asociacion="selectedAsociacion"
      @close="asociacionDialog = false"
    />
  </v-dialog>

  <!-- Diálogo de Feria -->
  <v-dialog v-model="feriaDialog" max-width="700">
    <FeriaDetailModal
      v-if="selectedFeria"
      :feria="selectedFeria"
      @close="feriaDialog = false"
    />
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AsociacionRedFormDialog from '@/components/AsociacionRedFormDialog.vue'
import RedFeriaFormDialog from '@/components/RedFeriaFormDialog.vue'
import AsociacionDetailModal from '@/components/AsociacionDetailModal.vue'
import FeriaDetailModal from '@/components/FeriaDetailModal.vue'

const panel = ref([0, 1])
const dialogAsociaciones = ref(false)
const dialogFerias = ref(false)

const asociacionDialog = ref(false)
const selectedAsociacion = ref<any>(null)
const feriaDialog = ref(false)
const selectedFeria = ref<any>(null)

const openAsociacionDialog = (item: any) => {
  selectedAsociacion.value = item
  asociacionDialog.value = true
}

const openFeriaDialog = (item: any) => {
  selectedFeria.value = item
  feriaDialog.value = true
}

const onAsociacionGuardada = (data: any) => {
  console.log('Asociación vinculada:', data)
}

const onFeriaGuardada = (data: any) => {
  console.log('Feria vinculada:', data)
}

const red = ref({
  id: 'RED-01',
  nombre: 'Red Agroecologica Nacional',
  asociaciones: [
    { idRelacion: 'AR-01', asociacion: 'Aso. San Antonio de Gapal', red: 'Red Agroecologica Nacional' },
    { idRelacion: 'AR-02', asociacion: 'Aso. De Productores de Jadán', red: 'Red Agroecologica Nacional' },
    { idRelacion: 'AR-05', asociacion: 'Aso. Dizha La Dolorosa', red: 'Red Agroecologica Nacional' },
    { idRelacion: 'AR-06', asociacion: 'Aso. ASOPROAMI', red: 'Red Agroecologica Nacional' }
  ],
  ferias: [
    { idRelacion: 'RF-01', feria: 'FA-01 - Feria del Productor', red: 'Red Agroecologica Nacional' },
    { idRelacion: '76b9a818', feria: 'FA-03 - Mercado Campesino', red: 'Red Agroecologica Nacional' }
  ]
})

const headersAsociaciones: any = [
  { title: 'IdAsociacionRed', key: 'idRelacion' },
  { title: 'IdAsociacion', key: 'asociacion' },
  { title: 'IdRed', key: 'red' },
  { title: '', key: 'action', sortable: false }
]

const headersFerias: any = [
  { title: 'IdRedFeria', key: 'idRelacion' },
  { title: 'IdFeria', key: 'feria' },
  { title: 'IdRed', key: 'red' },
  { title: '', key: 'action', sortable: false }
]
</script>
