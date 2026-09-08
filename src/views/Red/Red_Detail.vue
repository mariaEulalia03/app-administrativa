<template>
  <v-container fluid class="pa-6">
    <!-- Encabezado de Navegación -->
    <div class="d-flex align-center justify-space-between mb-4 position-sticky" style="top: 64px; z-index: 10; background-color: #f5f5f5; padding-top: 16px; padding-bottom: 8px; margin-top: -16px;">
      <div class="d-flex align-center">
        <v-btn icon="mdi-arrow-left" variant="text" @click="$router.back()"></v-btn>
        <h1 class="text-h5 font-weight-bold ms-2">Detalle de la Red</h1>
      </div>
      <div>
        <v-btn icon="mdi-delete-outline" color="error" variant="text" class="me-2" @click="confirmDeleteDialog = true"></v-btn>
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
                  v-for="item in (items as any[])"
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
                  v-for="item in (items as any[])"
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
      @open-productor="openProductorDialog"
      @open-red="openRedDialog"
      @open-feria="openFeriaDialog"
    />
  </v-dialog>

  <!-- Diálogo de Feria -->
  <v-dialog v-model="feriaDialog" max-width="700">
    <FeriaDetailModal
      v-if="selectedFeria"
      :feria="selectedFeria"
      @close="feriaDialog = false"
      @open-red="openRedDialog"
    />
  </v-dialog>

  <!-- Diálogo de Productor -->
  <v-dialog v-model="productorDialog" max-width="700">
    <ProductorDetailModal
      v-if="selectedProductor"
      :productor="selectedProductor"
      @close="productorDialog = false"
      @open-asociacion="openAsociacionDialog"
    />
  </v-dialog>

  <!-- Diálogo de Red -->
  <v-dialog v-model="redDialog" max-width="700">
    <RedDetailModal
      v-if="selectedRed"
      :red="selectedRed"
      @close="redDialog = false"
      @open-asociacion="openAsociacionDialog"
      @open-feria="openFeriaDialog"
    />
  </v-dialog>

  <!-- Diálogo de Confirmación de Eliminación -->
  <v-dialog v-model="confirmDeleteDialog" max-width="500">
    <v-card class="rounded-lg pa-2">
      <v-card-title class="d-flex align-center text-h6 font-weight-bold text-error">
        <v-icon color="error" class="me-2">mdi-alert-circle-outline</v-icon>
        ¿Eliminar Red?
      </v-card-title>
      <v-card-text class="py-2">
        ¿Estás seguro de que deseas eliminar la red <strong>{{ red.nombre }}</strong>? Esta acción no se puede deshacer.
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn variant="text" class="text-none" @click="confirmDeleteDialog = false">Cancelar</v-btn>
        <v-btn color="error" class="text-none" :loading="deleting" @click="onDeleteRed">Eliminar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { dbService } from '@/services/db.service'
import AsociacionRedFormDialog from '@/components/AsociacionRedFormDialog.vue'
import RedFeriaFormDialog from '@/components/RedFeriaFormDialog.vue'
import AsociacionDetailModal from '@/components/AsociacionDetailModal.vue'
import FeriaDetailModal from '@/components/FeriaDetailModal.vue'
import ProductorDetailModal from '@/components/ProductorDetailModal.vue'
import RedDetailModal from '@/components/RedDetailModal.vue'

const route = useRoute()
const router = useRouter()

const panel = ref([0, 1])
const dialogAsociaciones = ref(false)
const dialogFerias = ref(false)

const confirmDeleteDialog = ref(false)
const deleting = ref(false)

const onDeleteRed = async () => {
  deleting.value = true
  try {
    const idParam = route.params.id as string
    await dbService.deleteRed(idParam)
    confirmDeleteDialog.value = false
    router.push('/redes')
  } catch (err) {
    console.error('Error al eliminar la red:', err)
  } finally {
    deleting.value = false
  }
}

const asociacionDialog = ref(false)
const selectedAsociacion = ref<any>(null)
const feriaDialog = ref(false)
const selectedFeria = ref<any>(null)
const productorDialog = ref(false)
const selectedProductor = ref<any>(null)
const redDialog = ref(false)
const selectedRed = ref<any>(null)

const openAsociacionDialog = async (item: any) => {
  const idToFetch = typeof item === 'string' ? item : (item.idAsociacion || item.id);
  const fullAsoc = await dbService.getAsociacionById(idToFetch);
  selectedAsociacion.value = fullAsoc || item;
  asociacionDialog.value = true;
}

const openFeriaDialog = async (item: any) => {
  const idToFetch = typeof item === 'string' ? item : (item.idFeria || item.id);
  const fullFeria = await dbService.getFeriaById(idToFetch);
  selectedFeria.value = fullFeria || item;
  feriaDialog.value = true;
}

const openProductorDialog = async (item: any) => {
  const idToFetch = typeof item === 'string' ? item : (item.idProductor || item.id);
  const fullProd = await dbService.getProductorById(idToFetch);
  selectedProductor.value = fullProd || item;
  productorDialog.value = true;
}

const openRedDialog = async (item: any) => {
  const idToFetch = typeof item === 'string' ? item : (item.idRed || item.id);
  const fullRed = await dbService.getRedById(idToFetch);
  selectedRed.value = fullRed || item;
  redDialog.value = true;
}

const onAsociacionGuardada = (data: any) => {
  console.log('Asociación vinculada:', data)
}

const onFeriaGuardada = (data: any) => {
  console.log('Feria vinculada:', data)
}

const red = ref<any>({
  id: '',
  nombre: 'Cargando...',
  asociaciones: [],
  ferias: []
})

const loadRedData = async (id: string) => {
  if (!id) return
  const r = await dbService.getRedById(id)
  if (r) {
    red.value = {
      asociaciones: [],
      ferias: [],
      ...r
    }
  }
}

watch(() => route.params.id, (newId) => {
  if (newId) loadRedData(newId as string)
})

onMounted(async () => {
  const idRed = route.params.id as string;
  if (idRed) {
    await loadRedData(idRed)
  }
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
