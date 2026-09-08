<template>
  <v-card class="rounded-lg elevation-2">
    <v-card-title class="d-flex align-center justify-space-between pa-4 border-b bg-grey-lighten-4">
      <div class="d-flex align-center">
        <v-icon color="primary" class="me-2">mdi-certificate-outline</v-icon>
        <span class="text-h6 font-weight-bold">Detalle del Aval</span>
      </div>
      <div class="d-flex align-center">
        <v-btn color="primary" variant="text" prepend-icon="mdi-pencil" class="text-none font-weight-bold me-1" @click="$emit('edit')">
          Editar
        </v-btn>
        <v-btn icon="mdi-close" variant="text" size="small" @click="$emit('close')"></v-btn>
      </div>
    </v-card-title>

    <v-card-text class="pa-6">
      <v-row density="comfortable">
        <!-- IdAval -->
        <v-col cols="12" sm="6" md="4">
          <div class="text-caption text-grey font-weight-medium mb-1">IdAval</div>
          <div class="text-body-1 font-weight-bold">{{ aval.id || 'N/A' }}</div>
        </v-col>

        <!-- Nombre -->
        <v-col cols="12" sm="6" md="4">
          <div class="text-caption text-grey font-weight-medium mb-1">Nombre</div>
          <div class="text-body-1">{{ aval.nombre || 'N/A' }}</div>
        </v-col>

        <!-- Estado -->
        <v-col cols="12" sm="6" md="4">
          <div class="text-caption text-grey font-weight-medium mb-1">Estado</div>
          <div>
            <v-chip
              :color="getEstadoColor(aval.estado)"
              size="small"
              class="font-weight-bold"
              variant="flat"
            >
              {{ aval.estado || 'N/A' }}
            </v-chip>
          </div>
        </v-col>

        <!-- Entidad Control -->
        <v-col cols="12" sm="6" md="4">
          <div class="text-caption text-grey font-weight-medium mb-1">Entidad de Control</div>
          <div class="text-body-1">{{ aval.idEntidadControl || 'N/A' }}</div>
        </v-col>

        <!-- Fecha Otorga -->
        <v-col cols="12" sm="6" md="4">
          <div class="text-caption text-grey font-weight-medium mb-1">Fecha de Otorgamiento</div>
          <div class="text-body-1">
            <v-icon size="small" color="grey" class="me-1">mdi-calendar</v-icon>
            {{ aval.fechaOtorga || 'N/A' }}
          </div>
        </v-col>

        <!-- Fecha Finaliza -->
        <v-col cols="12" sm="6" md="4">
          <div class="text-caption text-grey font-weight-medium mb-1">Fecha de Finalización</div>
          <div class="text-body-1">
            <v-icon size="small" color="grey" class="me-1">mdi-calendar-alert</v-icon>
            {{ aval.fechaFinaliza || 'N/A' }}
          </div>
        </v-col>

        <!-- Productor -->
        <v-col cols="12" sm="12" class="mt-2">
          <v-divider class="mb-3"></v-divider>
          <div class="text-caption text-grey font-weight-medium mb-1">Productor Vinculado</div>
          <div class="d-flex align-center">
            <v-avatar size="32" color="primary-lighten-4" class="me-3">
              <v-icon color="primary" size="20">mdi-account-tie</v-icon>
            </v-avatar>
            <span class="text-body-1 font-weight-medium">{{ aval.idProductor || 'N/A' }}</span>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
defineProps({
  aval: {
    type: Object,
    default: () => ({
      id: '1',
      idEntidadControl: 'EDEC',
      nombre: 'Permiso Funcionamiento',
      estado: 'Activa',
      fechaOtorga: '2023-11-04',
      fechaFinaliza: '2024-11-04',
      idProductor: 'María Manuela Guncay León'
    })
  }
})

defineEmits(['edit', 'close'])

const getEstadoColor = (estado) => {
  if (estado === 'Activa') return 'success'
  if (estado === 'Caducada') return 'error'
  if (estado === 'Proceso') return 'warning'
  return 'grey'
}
</script>
