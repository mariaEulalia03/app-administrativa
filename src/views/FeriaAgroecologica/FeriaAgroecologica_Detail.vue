<template>
  <v-container fluid class="pa-6">
    <!-- Encabezado de Navegación -->
    <div class="d-flex align-center justify-space-between mb-4 position-sticky" style="top: 64px; z-index: 10; background-color: #f5f5f5; padding-top: 16px; padding-bottom: 8px; margin-top: -16px;">
      <div class="d-flex align-center">
        <v-btn icon="mdi-arrow-left" variant="text" @click="$router.back()"></v-btn>
        <h1 class="text-h5 font-weight-bold ms-2">Detalle de la FeriaAgroecológica</h1>
      </div>
      <div>
        <v-btn icon="mdi-delete-outline" color="error" variant="text" class="me-2" @click="confirmDeleteDialog = true"></v-btn>
        <v-btn color="primary" prepend-icon="mdi-pencil" class="text-none" @click="$router.push(`/ferias/${$route.params.id}/editar`)">Edit</v-btn>
      </div>
    </div>

    <!-- Tarjeta Principal con Imagen y Datos -->
    <v-card flat class="border rounded-lg pa-4 mb-6">
      <v-row>
        <v-col cols="12" md="4">
          <v-img
            src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
            height="180"
            cover
            class="rounded-lg bg-grey-lighten-2"
          ></v-img>
        </v-col>

        <v-col cols="12" md="8">
          <v-row density="compact">
            <v-col cols="12" sm="6">
              <div class="text-caption text-grey">ID Feriaagroecológica</div>
              <div class="text-body-1 font-weight-medium mb-3">{{ feria.id }}</div>
            </v-col>

            <v-col cols="12" sm="6">
              <div class="text-caption text-grey">Nombre</div>
              <div class="text-body-1 font-weight-bold mb-3">{{ feria.nombre }}</div>
            </v-col>

            <v-col cols="12" sm="12">
              <div class="text-caption text-grey mb-1">Dirección</div>
              <v-btn 
                variant="tonal" 
                color="primary" 
                size="small" 
                prepend-icon="mdi-map-marker"
                class="text-none font-weight-bold"
                @click="openDireccionDialog(feria.idDireccion)"
              >
                {{ feria.calles || 'Ver detalle de dirección' }}
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>

    <!-- Tablas de 2 columnas -->
    <v-row class="mb-4" align="stretch">
      <!-- Columna 1: Redes -->
      <v-col cols="12" md="6">
        <v-card elevation="0" class="border rounded-lg h-100 d-flex flex-column">
          <v-card-title class="d-flex align-center justify-space-between w-100 pa-4 border-b">
            <span class="font-weight-bold text-subtitle-1">Redes</span>
            <v-chip size="small" color="primary">{{ feria.redes.length }}</v-chip>
          </v-card-title>
          <v-card-text class="pa-4 flex-grow-1">
            <v-data-iterator
              :items="feria.redes"
              :items-per-page="5"
            >
              <template v-slot:default="{ items }">
                <v-row>
                  <v-col
                    v-for="item in (items as any[])"
                    :key="item.raw.idRedFeria"
                    cols="12"
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
                            {{ item.raw.idRed }}
                          </div>
                          <v-chip size="x-small" color="grey-lighten-2" class="text-grey-darken-3 font-weight-bold">
                            {{ item.raw.idRedFeria }}
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
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Columna 2: Horarios -->
      <v-col cols="12" md="6">
        <v-card elevation="0" class="border rounded-lg h-100 d-flex flex-column">
          <v-card-title class="d-flex align-center justify-space-between w-100 pa-4 border-b">
            <div class="d-flex align-center">
              <v-icon color="primary" size="small" class="me-2">mdi-clock-outline</v-icon>
              <span class="font-weight-bold text-subtitle-1">Horarios</span>
            </div>
            <v-chip size="small" color="primary">{{ feria.horarios.length }}</v-chip>
          </v-card-title>
          <v-card-text class="pa-3 flex-grow-1">
            <div
              v-for="item in feria.horarios"
              :key="item.idHorario"
              class="d-flex align-center pa-3 rounded-lg mb-2"
              style="background: #f8f9fa; border: 1px solid #e9ecef;"
            >
              <!-- Ícono de día -->
              <v-avatar size="40" color="primary-lighten-4" class="flex-shrink-0 me-3">
                <v-icon color="primary" size="20">mdi-calendar-week</v-icon>
              </v-avatar>

              <!-- Día y horario -->
              <div class="flex-grow-1" style="min-width: 0;">
                <div class="text-body-2 font-weight-bold text-grey-darken-3">
                  {{ Array.isArray(item.dias) ? item.dias.join(', ') : item.dia }}
                </div>
                <div class="d-flex align-center mt-1">
                  <v-icon size="x-small" color="grey" class="me-1">mdi-clock-start</v-icon>
                  <span class="text-caption text-grey-darken-1 me-2">{{ item.horaApertura }}</span>
                  <v-icon size="x-small" color="grey" class="me-1">mdi-arrow-right</v-icon>
                  <v-icon size="x-small" color="grey" class="me-1">mdi-clock-end</v-icon>
                  <span class="text-caption text-grey-darken-1">{{ item.horaCierre }}</span>
                </div>
              </div>

              <!-- Badge ID -->
              <v-chip size="x-small" color="grey-lighten-2" class="text-grey-darken-2 font-weight-medium flex-shrink-0 ms-2">
                {{ item.idHorario }}
              </v-chip>
            </div>

            <!-- Estado vacío -->
            <div v-if="!feria.horarios.length" class="text-center text-grey py-4">
              <v-icon size="large" color="grey-lighten-2">mdi-clock-remove-outline</v-icon>
              <div class="text-caption mt-1">Sin horarios registrados</div>
            </div>

            <div class="d-flex justify-end mt-2">
              <v-btn size="small" variant="text" color="primary" prepend-icon="mdi-plus" @click="dialogHorario = true">Add</v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

    </v-row>

    <!-- Tablas Expandibles -->
    <v-expansion-panels v-model="panel" multiple>

      <!-- Productos -->
      <v-expansion-panel elevation="0" class="border rounded-lg mb-4">
        <v-expansion-panel-title>
          <div class="d-flex align-center justify-space-between w-100 me-4">
            <span class="font-weight-bold text-subtitle-1">Productos</span>
            <v-chip size="small" color="primary">{{ feria.productos.length }}</v-chip>
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <div class="d-flex flex-wrap gap-2">
            <v-chip 
              v-for="(prod, i) in feria.productos" 
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

      <!-- Removed Productores Asociados -->
    </v-expansion-panels>

    <!-- Dialog de Horario -->
    <HorarioFormDialog v-model="dialogHorario" @save="onHorarioSaved" />
    <!-- Dialog de Redes -->
    <RedFeriaFormDialog v-model="dialogRedes" :prefilledIdFeria="feria.id" @save="onRedGuardada" />
  </v-container>

  <v-dialog v-model="alimentoDialog" max-width="800">
    <AlimentoDetail v-if="selectedAlimento" :alimento="selectedAlimento" />
  </v-dialog>

  <!-- Diálogo de Dirección -->
  <v-dialog v-model="direccionDialog" max-width="900">
    <DireccionDetailModal
      :id-direccion="selectedIdDireccion"
      :calles="feria.calles"
      @close="direccionDialog = false"
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

  <!-- Diálogo de Productor -->
  <v-dialog v-model="productorDialog" max-width="700">
    <ProductorDetailModal
      v-if="selectedProductor"
      :productor="selectedProductor"
      @close="productorDialog = false"
      @open-asociacion="openAsociacionDialog"
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
    <!-- Diálogo de Confirmación de Eliminación -->
    <v-dialog v-model="confirmDeleteDialog" max-width="450">
      <v-card class="pa-2">
        <v-card-title class="text-h6 font-weight-bold text-error d-flex align-center">
          <v-icon color="error" class="me-2">mdi-alert-circle-outline</v-icon>
          ¿Eliminar Feria Agroecológica?
        </v-card-title>
        <v-card-text>
          ¿Está seguro de que desea eliminar la feria <strong>{{ feria.nombre }}</strong>? Esta acción no se puede deshacer.
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="confirmDeleteDialog = false" :disabled="deleting">Cancelar</v-btn>
          <v-btn color="error" variant="flat" @click="onDeleteFeria" :loading="deleting">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAlimentos } from '@/services/apiService'
import { dbService } from '@/services/db.service'
import AlimentoDetail from '@/components/AlimentoDetail.vue'
import HorarioFormDialog from '@/components/HorarioFormDialog.vue'
import RedFeriaFormDialog from '@/components/RedFeriaFormDialog.vue'
import DireccionDetailModal from '@/components/DireccionDetailModal.vue'
import RedDetailModal from '@/components/RedDetailModal.vue'
import AsociacionDetailModal from '@/components/AsociacionDetailModal.vue'
import ProductorDetailModal from '@/components/ProductorDetailModal.vue'
import FeriaDetailModal from '@/components/FeriaDetailModal.vue'

const route = useRoute()
const router = useRouter()
const panel = ref([0, 1, 2])
const dialogHorario = ref(false)
const dialogRedes = ref(false)
const confirmDeleteDialog = ref(false)
const deleting = ref(false)

const onDeleteFeria = async () => {
  deleting.value = true
  try {
    await dbService.deleteFeria(feria.value.id || (route.params.id as string))
    confirmDeleteDialog.value = false
    router.push('/ferias')
  } catch (error) {
    console.error('Error al eliminar la feria:', error)
  } finally {
    deleting.value = false
  }
}

const direccionDialog = ref(false)
const selectedIdDireccion = ref<string | number>('')
const redDialog = ref(false)
const selectedRed = ref<any>(null)
const asociacionDialog = ref(false)
const selectedAsociacion = ref<any>(null)
const productorDialog = ref(false)
const selectedProductor = ref<any>(null)
const feriaDialog = ref(false)
const selectedFeria = ref<any>(null)

const openDireccionDialog = (idDireccion: string | number) => {
  selectedIdDireccion.value = idDireccion
  direccionDialog.value = true
}

const openRedDialog = async (item: any) => {
  const idToFetch = typeof item === 'string' ? item : (item.rawRedId || item.idRed || item.id);
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

const openProductorDialog = async (item: any) => {
  const idToFetch = typeof item === 'string' ? item : (item.idProductor || item.id);
  const fullProd = await dbService.getProductorById(idToFetch);
  selectedProductor.value = fullProd || item;
  productorDialog.value = true;
}

const openFeriaDialog = async (item: any) => {
  const idToFetch = typeof item === 'string' ? item : (item.idFeria || item.id);
  const fullFeria = await dbService.getFeriaById(idToFetch);
  selectedFeria.value = fullFeria || item;
  feriaDialog.value = true;
}

const onHorarioSaved = (data: any) => {
  console.log('Horario guardado:', data)
  // Aquí se podría guardar el horario en la base de datos o añadirlo a la lista local
}

const onRedGuardada = (data: any) => {
  console.log('Red vinculada:', data)
}

const feria = ref<any>({
  id: '',
  nombre: 'Cargando...',
  idDireccion: '',
  calles: '',
  entidadControl: '',
  redes: [],
  horarios: [],
  productos: [],
  productores: []
})

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

const loadFeriaData = async (id: string) => {
  if (!id) return
  const f = await dbService.getFeriaById(id)
  if (f) {
    feria.value = {
      redes: [],
      horarios: [],
      productos: [],
      productores: [],
      ...f
    }
  }
}

watch(() => route.params.id, (newId) => {
  if (newId) loadFeriaData(newId as string)
})

onMounted(async () => {
  getAlimentos().then(data => {
    alimentosData.value = data
  }).catch(e => console.error(e))

  const idFeria = route.params.id as string;
  if (idFeria) {
    await loadFeriaData(idFeria)
  }
})

const headersRedes: any = [
  { title: 'IdRedFeria', key: 'idRedFeria' },
  { title: 'IdFeria', key: 'idFeria' },
  { title: 'IdRed', key: 'idRed' },
  { title: '', key: 'action', sortable: false }
]

const headersHorarios: any = [
  { title: 'IdHorario', key: 'idHorario' },
  { title: 'HoraApertura', key: 'horaApertura' },
  { title: 'HoraCierre', key: 'horaCierre' },
  { title: 'Dia', key: 'dia' },
  { title: 'id_feria', key: 'idFeria' },
  { title: '', key: 'action', sortable: false }
]
</script>
