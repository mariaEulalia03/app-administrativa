<template>
  <v-container fluid class="pa-6">
    <!-- Encabezado con Navegación y Acciones -->
    <div class="d-flex align-center justify-space-between mb-4 position-sticky" style="top: 64px; z-index: 10; background-color: #f5f5f5; padding-top: 16px; padding-bottom: 8px; margin-top: -16px;">
      <div class="d-flex align-center">
        <v-btn icon="mdi-arrow-left" variant="text" @click="$router.back()"></v-btn>
        <h1 class="text-h5 font-weight-bold ms-2">Detalles de la Asociación</h1>
      </div>
      <div>
        <v-btn icon="mdi-delete-outline" color="error" variant="text" class="me-2" @click="confirmDeleteDialog = true"></v-btn>
        <v-btn color="primary" prepend-icon="mdi-pencil" class="text-none" @click="$router.push(`/asociaciones/${$route.params.id}/editar`)">Edit</v-btn>
      </div>
    </div>

    <!-- Datos Principales de la Entidad -->
    <v-card flat class="border rounded-lg pa-4 mb-6">
      <v-row align="center">
        <v-col cols="12" sm="3" md="2" class="text-center">
          <v-avatar size="80" color="primary-lighten-4">
            <v-icon size="40" color="primary">mdi-account-group</v-icon>
          </v-avatar>
        </v-col>
        <v-col cols="12" sm="9" md="10">
          <div class="text-caption text-grey">Nombre</div>
          <div class="text-h6 font-weight-bold mb-2">{{ asociacion.nombre }}</div>

          <div class="text-caption text-grey">ID Asociación</div>
          <div class="text-body-1 font-weight-medium">{{ asociacion.id }}</div>
        </v-col>
      </v-row>
    </v-card>

    <!-- Secciones Relacionadas (Acordeón / Paneles) -->
    <v-expansion-panels v-model="panel" multiple class="gap-4">
      
      <!-- Tabla: Productores Asociados -->
      <v-expansion-panel elevation="0" class="border rounded-lg mb-4">
        <v-expansion-panel-title>
          <div class="d-flex align-center justify-space-between w-100 me-4">
            <span class="font-weight-bold text-subtitle-1">Productores Asociados</span>
            <v-chip size="small" color="primary">{{ asociacion.productores?.length || 0 }}</v-chip>
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-data-iterator
            :items="asociacion.productores || []"
            :items-per-page="5"
          >
            <template v-slot:default="{ items }">
              <v-row>
                <v-col
                  v-for="item in (items as any[])"
                  :key="item.raw.id"
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
                    @click="openProductorDialog(item.raw)"
                  >
                    <v-card-text class="pa-4 flex-grow-1">
                      <div class="d-flex justify-space-between align-start mb-3">
                        <div class="text-subtitle-1 font-weight-bold text-primary text-truncate pe-2">
                          {{ item.raw.nombre }}
                        </div>
                        <v-chip size="x-small" color="grey-lighten-2" class="text-grey-darken-3 font-weight-bold">
                          {{ item.raw.id }}
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
            <v-btn size="small" variant="text" color="primary" prepend-icon="mdi-plus">Add</v-btn>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- Tabla: Redes -->
      <v-expansion-panel elevation="0" class="border rounded-lg mb-4">
        <v-expansion-panel-title>
          <div class="d-flex align-center justify-space-between w-100 me-4">
            <span class="font-weight-bold text-subtitle-1">Redes</span>
            <v-chip size="small" color="primary">{{ asociacion.redes?.length || 0 }}</v-chip>
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-data-iterator
            :items="asociacion.redes || []"
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
                    @click="openRedDialog(item.raw)"
                  >
                    <v-card-text class="pa-4 flex-grow-1">
                      <div class="d-flex justify-space-between align-start mb-3">
                        <div class="text-subtitle-1 font-weight-bold text-primary text-truncate pe-2">
                          {{ item.raw.red }}
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
            <v-btn size="small" variant="text" color="primary" prepend-icon="mdi-plus" @click="dialogRedes = true">Add</v-btn>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- Chips: Productos -->
      <v-expansion-panel elevation="0" class="border rounded-lg">
        <v-expansion-panel-title>
          <div class="d-flex align-center justify-space-between w-100 me-4">
            <span class="font-weight-bold text-subtitle-1">Productos</span>
            <v-chip size="small" color="primary">{{ asociacion.productos?.length || 0 }}</v-chip>
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <div class="d-flex flex-wrap gap-2">
            <v-chip 
              v-for="(prod, i) in (asociacion.productos || [])" 
              :key="i" 
              variant="outlined" 
              size="small"
              color="primary"
              class="me-2 mb-2"
              style="cursor: pointer;"
              @click="openAlimento(prod)"
            >
              {{ prod }}
            </v-chip>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>

    </v-expansion-panels>

    <AsociacionRedFormDialog v-model="dialogRedes" :prefilledIdAsociacion="asociacion.id" @save="onRelacionGuardada" />
  </v-container>

  <v-dialog v-model="alimentoDialog" max-width="800">
    <AlimentoDetail v-if="selectedAlimento" :alimento="selectedAlimento" />
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

  <!-- Diálogo de Confirmación de Eliminación -->
  <v-dialog v-model="confirmDeleteDialog" max-width="500">
    <v-card class="rounded-lg pa-2">
      <v-card-title class="d-flex align-center text-h6 font-weight-bold text-error">
        <v-icon color="error" class="me-2">mdi-alert-circle-outline</v-icon>
        ¿Eliminar Asociación?
      </v-card-title>
      <v-card-text class="py-2">
        ¿Estás seguro de que deseas eliminar la asociación <strong>{{ asociacion.nombre }}</strong>? Esta acción no se puede deshacer.
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn variant="text" class="text-none" @click="confirmDeleteDialog = false">Cancelar</v-btn>
        <v-btn color="error" class="text-none" :loading="deleting" @click="onDeleteAsociacion">Eliminar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { dbService } from '@/services/db.service'
import { getAlimentos } from '@/services/apiService'
import AsociacionRedFormDialog from '@/components/AsociacionRedFormDialog.vue'
import AlimentoDetail from '@/components/AlimentoDetail.vue'
import ProductorDetailModal from '@/components/ProductorDetailModal.vue'
import RedDetailModal from '@/components/RedDetailModal.vue'
import AsociacionDetailModal from '@/components/AsociacionDetailModal.vue'
import FeriaDetailModal from '@/components/FeriaDetailModal.vue'

const route = useRoute()
const router = useRouter()
const panel = ref([0, 1, 2]) // Abre todos los paneles por defecto
const dialogRedes = ref(false)

const confirmDeleteDialog = ref(false)
const deleting = ref(false)

const onDeleteAsociacion = async () => {
  deleting.value = true
  try {
    const idParam = route.params.id as string
    await dbService.deleteAsociacion(idParam)
    confirmDeleteDialog.value = false
    router.push('/asociaciones')
  } catch (err) {
    console.error('Error al eliminar asociación:', err)
  } finally {
    deleting.value = false
  }
}

const productorDialog = ref(false)
const selectedProductor = ref<any>(null)
const redDialog = ref(false)
const selectedRed = ref<any>(null)
const asociacionDialog = ref(false)
const selectedAsociacion = ref<any>(null)
const feriaDialog = ref(false)
const selectedFeria = ref<any>(null)

const openProductorDialog = async (item: any) => {
  const idToFetch = typeof item === 'string' ? item : (item.idProductor || item.id);
  const fullProd = await dbService.getProductorById(idToFetch);
  selectedProductor.value = fullProd || item;
  productorDialog.value = true;
}

const openRedDialog = async (item: any) => {
  const idToFetch = typeof item === 'string' ? item : (item.idRed || item.idRelacion || item.id);
  const fullRed = await dbService.getRedById(idToFetch);
  selectedRed.value = fullRed || item;
  redDialog.value = true;
}

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

const onRelacionGuardada = (data: any) => {
  console.log('Relación guardada:', data)
}

const asociacion = ref<any>({
  id: '',
  nombre: 'Cargando...',
  productores: [],
  redes: [],
  productos: []
})

const headersProductores = [
  { title: 'ID Productor', key: 'id' },
  { title: 'Productor', key: 'nombre' },
  { title: 'Asociación', key: 'asociacion' },
  { title: '', key: 'action', sortable: false }
]

const alimentosData = ref<any[]>([])
const alimentoDialog = ref(false)
const selectedAlimento = ref(null)

const openAlimento = (nombre: string) => {
  const found = alimentosData.value.find((a: any) => 
    a.nombre?.toLowerCase().trim() === nombre?.toLowerCase().trim()
  )
  if (found) {
    selectedAlimento.value = found
  } else {
    selectedAlimento.value = { nombre } as any
  }
  alimentoDialog.value = true
}

const headersRedes = [
  { title: 'IdAsociacionRed', key: 'idRelacion' },
  { title: 'IdAsociacion', key: 'asociacion' },
  { title: 'IdRed', key: 'red' },
  { title: '', key: 'action', sortable: false }
]

const loadAsociacionData = async (id: string) => {
  if (!id) return
  const a = await dbService.getAsociacionById(id)
  if (a) {
    asociacion.value = {
      productores: [],
      redes: [],
      productos: [],
      ...a
    }
  }
}

watch(() => route.params.id, (newId) => {
  if (newId) loadAsociacionData(newId as string)
})

onMounted(async () => {
  getAlimentos().then(data => {
    alimentosData.value = data
  }).catch(e => console.error(e))

  const idAso = route.params.id as string
  if (idAso) {
    await loadAsociacionData(idAso)
  }
})
</script>
