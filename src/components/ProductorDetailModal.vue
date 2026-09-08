<template>
  <v-card class="rounded-lg elevation-2">
    <v-card-title class="d-flex align-center justify-space-between pa-4 border-b bg-grey-lighten-4">
      <div class="d-flex align-center">
        <v-avatar size="42" color="primary-lighten-4" class="me-3">
          <v-icon color="primary">mdi-account-hard-hat</v-icon>
        </v-avatar>
        <div>
          <div class="text-h6 font-weight-bold">{{ productor.nombre || productor.nombresCompletos }}</div>
          <div class="text-caption text-grey">Productor</div>
        </div>
      </div>
      <v-btn icon="mdi-close" variant="text" size="small" @click="$emit('close')"></v-btn>
    </v-card-title>

    <v-card-text class="pa-6">
      <v-row density="comfortable">
        <v-col cols="12" sm="6" md="4">
          <div class="text-caption text-grey font-weight-medium mb-1">Cédula</div>
          <div class="text-body-1 font-weight-medium">{{ productor.cedula || 'N/A' }}</div>
        </v-col>

        <v-col cols="12" sm="6" md="4">
          <div class="text-caption text-grey font-weight-medium mb-1">Contacto</div>
          <div class="text-body-1 font-weight-medium">{{ productor.contacto || 'N/A' }}</div>
        </v-col>

        <v-col cols="12" sm="6" md="4">
          <div class="text-caption text-grey font-weight-medium mb-1">Actividad Económica</div>
          <div class="text-body-1">{{ productor.actividadEconomica || productor.tipo || 'N/A' }}</div>
        </v-col>

        <v-col cols="12">
          <v-divider class="my-2"></v-divider>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <div class="text-caption text-grey font-weight-medium mb-1">Provincia</div>
          <div class="text-body-2">{{ productor.provincia || productor.ubicacion?.provincia || 'N/A' }}</div>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <div class="text-caption text-grey font-weight-medium mb-1">Cantón</div>
          <div class="text-body-2">{{ productor.canton || productor.ubicacion?.canton || 'N/A' }}</div>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <div class="text-caption text-grey font-weight-medium mb-1">Parroquia</div>
          <div class="text-body-2">{{ productor.parroquia || productor.ubicacion?.parroquia || 'N/A' }}</div>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <div class="text-caption text-grey font-weight-medium mb-1">Barrio / Comunidad</div>
          <div class="text-body-2">{{ productor.sector || productor.ubicacion?.barrio || 'N/A' }}</div>
        </v-col>

        <v-col v-if="productor.aval" cols="12">
          <v-divider class="my-2"></v-divider>
          <div class="text-caption text-grey font-weight-medium mb-2">Aval Otorgado</div>
          <v-chip
            :color="productor.aval.color === 'Verde' ? 'success' : productor.aval.color === 'Tomate' ? 'warning' : 'info'"
            variant="flat"
            size="small"
            class="font-weight-bold"
          >
            {{ productor.aval.estado || productor.aval }}
          </v-chip>
        </v-col>

        <v-col v-if="productor.id || productor.idProductor" cols="12" sm="6">
          <div class="text-caption text-grey font-weight-medium mb-1">ID Productor</div>
          <div class="text-body-2 font-weight-medium">{{ productor.id || productor.idProductor }}</div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
defineProps({
  productor: {
    type: Object,
    default: () => ({})
  }
})

defineEmits(['close'])
</script>
