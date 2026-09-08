<template>
  <v-card flat class="pa-4 rounded-lg border">
    <div class="d-flex justify-space-between align-start mb-3">
      <div>
        <div class="text-subtitle-2 text-grey-darken-1">{{ tipo }}</div>
        <div class="d-flex align-center mt-1">
          <v-icon color="primary" size="small" class="me-1">mdi-map-marker-outline</v-icon>
          <span class="font-weight-bold">{{ parroquia }}</span>
        </div>
        <div class="text-caption text-grey me-2">{{ sector }}</div>
      </div>
      <v-chip
        v-if="aval"
        size="small"
        :color="aval.color === 'Verde' ? 'success' : aval.color === 'Tomate' ? 'warning' : 'info'"
        variant="flat"
        class="font-weight-medium"
      >
        {{ aval.estado }}
      </v-chip>
    </div>

    <div class="text-subtitle-1 font-weight-bold text-grey-darken-3 mt-2">
      {{ nombre }}
    </div>

    <div v-if="cedula || contacto" class="d-flex flex-wrap align-center mt-2 pt-2 border-t text-caption text-grey-darken-1">
      <div v-if="cedula" class="d-flex align-center me-3">
        <v-icon size="x-small" class="me-1" color="grey-darken-1">mdi-card-account-details-outline</v-icon>
        <span><strong>C.I:</strong> {{ cedula }}</span>
      </div>
      <div v-if="contacto" class="d-flex align-center">
        <v-icon size="x-small" class="me-1" color="grey-darken-1">mdi-phone-outline</v-icon>
        <span><strong>Contacto:</strong> {{ contacto }}</span>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

defineProps({
  nombre: { type: String, required: true },
  tipo: { type: String, required: true },
  parroquia: { type: String, required: true },
  sector: { type: String, required: true },
  cedula: { type: [String, Number], default: '' },
  contacto: { type: [String, Number], default: '' },
  aval: {
    type: Object as PropType<{ estado: string; color: string; descripcion?: string }>,
    default: null
  }
})
</script>

