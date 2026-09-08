<template>
  <v-container fluid class="pa-6">
    <!-- Encabezado con Navegación y Acciones -->
    <div class="d-flex align-center justify-space-between mb-4 position-sticky" style="top: 64px; z-index: 10; background-color: #f5f5f5; padding-top: 16px; padding-bottom: 8px; margin-top: -16px;">
      <div class="d-flex align-center">
        <v-btn icon="mdi-arrow-left" variant="text" @click="$router.back()"></v-btn>
        <h1 class="text-h5 font-weight-bold ms-2">Detalle del Productor</h1>
      </div>
      <div>
        <v-btn icon="mdi-delete-outline" color="error" variant="text" class="me-2"></v-btn>
        <v-btn color="primary" prepend-icon="mdi-pencil" class="text-none" @click="$router.push(`/productores/${$route.params.id}/editar`)">Edit</v-btn>
      </div>
    </div>

    <!-- Tarjeta Principal de Información -->
    <v-card flat class="border rounded-lg pa-4 mb-6">
      <v-row>
        <v-col cols="12" sm="3" md="2" class="text-center">
          <v-avatar size="100" color="primary-lighten-4">
            <v-icon size="50" color="primary">mdi-account-hard-hat</v-icon>
          </v-avatar>
        </v-col>
        
        <v-col cols="12" sm="9" md="10">
          <div class="d-flex justify-space-between align-start">
            <div>
              <div class="text-h5 font-weight-bold">{{ productor.nombresCompletos }}</div>
              <div class="text-subtitle-2 text-primary mb-2">{{ productor.actividadEconomica }}</div>
            </div>
            
            <div class="d-flex gap-2">
              <v-btn icon="mdi-phone" color="success" variant="tonal" size="small" class="me-2"></v-btn>
              <v-btn icon="mdi-message-text" color="primary" variant="tonal" size="small"></v-btn>
            </div>
          </div>
          
          <v-row density="compact" class="mt-2">
            <v-col cols="12" sm="6" md="3">
              <div class="text-caption text-grey">Nombres</div>
              <div class="text-body-2 font-weight-medium">{{ productor.nombres }}</div>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <div class="text-caption text-grey">Apellidos</div>
              <div class="text-body-2 font-weight-medium">{{ productor.apellidos }}</div>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <div class="text-caption text-grey">Cédula</div>
              <div class="text-body-2 font-weight-medium">{{ productor.cedula }}</div>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <div class="text-caption text-grey">Contacto</div>
              <div class="text-body-2 font-weight-medium">{{ productor.contacto }}</div>
            </v-col>
          </v-row>

          <v-divider class="my-4"></v-divider>
          
          <div class="text-subtitle-2 font-weight-bold mb-2">Ubicación Geográfica</div>
          <v-row density="compact">
            <v-col cols="12" sm="6" md="3">
              <div class="text-caption text-grey">Provincia</div>
              <div class="text-body-2">{{ productor.ubicacion.provincia }}</div>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <div class="text-caption text-grey">Cantón</div>
              <div class="text-body-2">{{ productor.ubicacion.canton }}</div>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <div class="text-caption text-grey">Parroquia</div>
              <div class="text-body-2">{{ productor.ubicacion.parroquia }}</div>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <div class="text-caption text-grey">Barrio / Comunidad</div>
              <div class="text-body-2">{{ productor.ubicacion.barrio }}</div>
            </v-col>
            <v-col cols="12" sm="12" class="mt-2">
              <div class="text-caption text-grey mb-1">Dirección</div>
              <v-btn 
                variant="tonal" 
                color="primary" 
                size="small" 
                prepend-icon="mdi-map-marker"
                class="text-none font-weight-bold"
                @click="openDireccionDialog(productor.ubicacion.idDireccion)"
              >
                {{ productor.ubicacion.calles !== 'Sin calles' ? productor.ubicacion.calles : 'Ver detalle de dirección' }}
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>

    <!-- Secciones a 3 columnas -->
    <v-row class="mb-4" align="stretch">
      
      <!-- Columna 1: Aval -->
      <v-col cols="12" md="4">
        <v-card 
          elevation="0" 
          class="border rounded-lg h-100 d-flex flex-column cursor-pointer" 
          hover
          @click="openAvalDetail"
        >
          <v-card-title class="d-flex align-center justify-space-between w-100 pa-4 border-b">
            <span class="font-weight-bold text-subtitle-1">Aval Otorgado</span>
            <v-icon color="grey">mdi-chevron-right</v-icon>
          </v-card-title>
          <v-card-text class="pa-4 flex-grow-1">
            <div class="d-flex flex-column align-start mb-2 h-100">
              <v-chip
                :color="productor.aval.color === 'Verde' ? 'success' : productor.aval.color === 'Tomate' ? 'warning' : 'info'"
                variant="flat"
                class="font-weight-bold mb-3"
              >
                {{ productor.aval.estado }}
              </v-chip>
              <div class="text-body-2 text-grey-darken-2">
                {{ productor.aval.descripcion }}
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Columna 2: Agroecosistema -->
      <v-col cols="12" md="4">
        <v-card 
          elevation="0" 
          class="border rounded-lg h-100 d-flex flex-column cursor-pointer" 
          hover
          @click="openAgroecosistemaDialog"
        >
          <v-card-title class="d-flex align-center justify-space-between w-100 pa-4 border-b">
            <div class="d-flex align-center">
              <v-icon color="success" class="me-2">mdi-leaf</v-icon>
              <span class="font-weight-bold text-subtitle-1">Agroecosistema</span>
            </div>
            <v-icon color="grey">mdi-chevron-right</v-icon>
          </v-card-title>
          <v-card-text class="pa-4 flex-grow-1">
            <v-row density="compact" class="ma-0 h-100 align-content-start">
              <v-col cols="12" sm="6">
                <div class="text-caption text-grey">Área</div>
                <div class="text-body-2 font-weight-medium">{{ productor.agroecosistema.area }}</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-caption text-grey">Tipo de Área</div>
                <div class="text-body-2 font-weight-medium">{{ productor.agroecosistema.tipoArea }}</div>
              </v-col>
              <v-col cols="12" class="mt-2">
                <div class="text-caption text-grey">
                  ID: <span class="text-body-2 text-black">{{ productor.agroecosistema.idAgroecosistema }}</span>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Columna 3: Productos -->
      <v-col cols="12" md="4">
        <v-card elevation="0" class="border rounded-lg h-100 d-flex flex-column">
          <v-card-title class="d-flex align-center justify-space-between w-100 pa-4 border-b">
            <span class="font-weight-bold text-subtitle-1">Productos</span>
            <v-chip size="small" color="primary">{{ productos.length }}</v-chip>
          </v-card-title>
          <v-card-text class="pa-4 flex-grow-1">
            <div class="d-flex flex-wrap gap-2">
              <v-chip 
                v-for="(prod, i) in productos" 
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
            <div class="d-flex justify-end mt-2">
              <v-btn size="small" variant="text" color="primary" prepend-icon="mdi-plus">Add</v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Asociaciones Vinculadas -->
    <v-expansion-panels v-model="panel" multiple class="gap-4">
      <v-expansion-panel elevation="0" class="border rounded-lg mb-4">
        <v-expansion-panel-title>
          <div class="d-flex align-center justify-space-between w-100 me-4">
            <span class="font-weight-bold text-subtitle-1">Asociaciones Vinculadas</span>
            <v-chip size="small" color="primary">{{ asociaciones.length }}</v-chip>
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-data-iterator
            :items="asociaciones"
            :items-per-page="5"
          >
            <template v-slot:default="{ items }">
              <v-row>
                <v-col
                  v-for="item in items"
                  :key="item.raw.idProductorAsociacion"
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
                          {{ item.raw.idProductorAsociacion }}
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
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>

  <v-dialog v-model="alimentoDialog" max-width="800">
    <AlimentoDetail v-if="selectedAlimento" :alimento="selectedAlimento" />
  </v-dialog>

  <!-- Diálogo de Aval -->
  <v-dialog v-model="avalDialog" max-width="800">
    <AvalDetail
      v-if="!isEditingAval && currentAval"
      :aval="currentAval"
      @edit="isEditingAval = true"
      @close="avalDialog = false"
    />
    <AvalForm
      v-else-if="isEditingAval && currentAval"
      :aval="currentAval"
      @cancel="isEditingAval = false"
      @save="handleSaveAval"
    />
  </v-dialog>

  <!-- Diálogo de Agroecosistema -->
  <v-dialog v-model="agroecosistemaDialog" max-width="700">
    <AgroecosistemaDetailModal
      :agroecosistema="productor.agroecosistema"
      :productos="productos"
      @close="agroecosistemaDialog = false"
    />
  </v-dialog>

  <!-- Diálogo de Dirección -->
  <v-dialog v-model="direccionDialog" max-width="900">
    <DireccionDetailModal
      :id-direccion="selectedIdDireccion"
      :calles="productor.ubicacion.calles"
      @close="direccionDialog = false"
    />
  </v-dialog>

  <!-- Diálogo de Asociación -->
  <v-dialog v-model="asociacionDialog" max-width="700">
    <AsociacionDetailModal
      v-if="selectedAsociacion"
      :asociacion="selectedAsociacion"
      @close="asociacionDialog = false"
    />
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { dbService } from '@/services/db.service'
import { getAlimentos } from '@/services/apiService'
import AlimentoDetail from '@/components/AlimentoDetail.vue'
import AvalDetail from '@/components/AvalDetail.vue'
import AvalForm from '@/components/AvalForm.vue'
import AgroecosistemaDetailModal from '@/components/AgroecosistemaDetailModal.vue'
import DireccionDetailModal from '@/components/DireccionDetailModal.vue'
import AsociacionDetailModal from '@/components/AsociacionDetailModal.vue'

const route = useRoute()
const panel = ref([0, 1, 2, 3]) // Abre paneles por defecto

const productor = ref<any>({
  nombresCompletos: 'Cargando...',
  nombres: '',
  apellidos: '',
  cedula: '',
  contacto: '',
  actividadEconomica: '',
  ubicacion: {
    barrio: '',
    parroquia: '',
    canton: '',
    provincia: '',
    idDireccion: ''
  },
  aval: {
    estado: '',
    color: 'Verde',
    descripcion: ''
  },
  agroecosistema: {
    idAgroecosistema: '',
    idDireccion: '',
    area: '',
    tipoArea: '',
    productos: ''
  }
})

const asociaciones = ref<any>([])
const productos = ref<string[]>([])
const alimentosData = ref<any[]>([])
const alimentoDialog = ref(false)
const selectedAlimento = ref(null)

const avalDialog = ref(false)
const isEditingAval = ref(false)
const currentAval = ref<any>(null)

const agroecosistemaDialog = ref(false)
const direccionDialog = ref(false)
const selectedIdDireccion = ref<string | number>('')
const asociacionDialog = ref(false)
const selectedAsociacion = ref<any>(null)

const openAvalDetail = () => {
  isEditingAval.value = false
  avalDialog.value = true
}

const openAgroecosistemaDialog = () => {
  agroecosistemaDialog.value = true
}

const openDireccionDialog = (idDireccion: string | number) => {
  selectedIdDireccion.value = idDireccion
  direccionDialog.value = true
}

const openAsociacionDialog = (item: any) => {
  selectedAsociacion.value = item
  asociacionDialog.value = true
}

const handleSaveAval = (updatedAval: any) => {
  currentAval.value = updatedAval
  isEditingAval.value = false
  if (productor.value.aval) {
    productor.value.aval.estado = updatedAval.estado
    productor.value.aval.color = updatedAval.estado === 'Activa' ? 'Verde' : updatedAval.estado === 'Proceso' ? 'Tomate' : 'Azul'
  }
}

const openAlimento = (nombre: string) => {
  const found = alimentosData.value.find((a: any) => a.nombre === nombre)
  if (found) {
    selectedAlimento.value = found
  } else {
    selectedAlimento.value = { nombre } as any
  }
  alimentoDialog.value = true
}

const headersAsociaciones: any = [
  { title: 'ID Productor - Asociación', key: 'idProductorAsociacion' },
  { title: 'Productor', key: 'productor' },
  { title: 'Asociación', key: 'asociacion' },
  { title: '', key: 'action', sortable: false }
]

onMounted(async () => {
  const id = String(route.params.id)
  
  // Load Alimentos API
  getAlimentos().then(data => {
    alimentosData.value = data
  }).catch(e => console.error(e))

  // Fetch Productor
  const pData = await dbService.getProductorById(id)
  if (pData) {
    productor.value.nombresCompletos = pData.nombresCompletos
    productor.value.nombres = pData.nombres
    productor.value.apellidos = pData.apellidos
    productor.value.cedula = pData.cedula
    productor.value.contacto = pData.contacto
    productor.value.actividadEconomica = pData.actividadEconomica
    productor.value.ubicacion = pData.ubicacion
    productor.value.aval = pData.aval
  }

  // Fetch Aval
  const avalObj = await dbService.getAvalByProductor(id)
  if (avalObj) {
    currentAval.value = avalObj
  } else {
    currentAval.value = {
      id: `AV-${id}`,
      idEntidadControl: 'EDEC',
      nombre: 'Permiso Funcionamiento',
      estado: productor.value.aval?.estado || 'Activa',
      fechaOtorga: '2023-11-04',
      fechaFinaliza: '2024-11-04',
      idProductor: productor.value.nombresCompletos || `Productor #${id}`
    }
  }

  // Fetch Agroecosistema
  const agroData = await dbService.getAgroecosistemaByProductor(id)
  if (agroData) {
    productor.value.agroecosistema = {
      idAgroecosistema: agroData.idAgroecosistema,
      idDireccion: agroData.idDireccion,
      area: `${agroData.area} m²`,
      tipoArea: agroData.tipoArea
    }
    productos.value = agroData.productos
  } else {
    productor.value.agroecosistema = {
      idAgroecosistema: 'Sin Asignar',
      idDireccion: 'N/A',
      area: '0 m²',
      tipoArea: 'Ninguno'
    }
  }
})
</script>
