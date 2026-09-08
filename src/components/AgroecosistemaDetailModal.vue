<template>
  <v-card class="rounded-lg elevation-2">
    <v-card-title class="d-flex align-center justify-space-between pa-4 border-b bg-grey-lighten-4">
      <div class="d-flex align-center">
        <v-icon color="success" class="me-2">mdi-leaf</v-icon>
        <span class="text-h6 font-weight-bold">Agroecosistema</span>
      </div>
      <v-btn icon="mdi-close" variant="text" size="small" @click="$emit('close')"></v-btn>
    </v-card-title>

    <v-card-text class="pa-6">
      <v-row density="comfortable">
        <v-col cols="12" sm="6">
          <div class="text-caption text-grey font-weight-medium mb-1">ID Agroecosistema</div>
          <div class="text-body-1 font-weight-medium">{{ agroecosistema.idAgroecosistema || 'N/A' }}</div>
        </v-col>

        <v-col cols="12" sm="6">
          <div class="text-caption text-grey font-weight-medium mb-1">Área</div>
          <div class="text-body-1 font-weight-medium">{{ agroecosistema.area || 'N/A' }}</div>
        </v-col>

        <v-col cols="12" sm="6">
          <div class="text-caption text-grey font-weight-medium mb-1">Tipo de Área</div>
          <v-chip color="success" size="small" variant="tonal">
            {{ agroecosistema.tipoArea || 'N/A' }}
          </v-chip>
        </v-col>

        <v-col v-if="agroecosistema.idDireccion" cols="12" sm="6">
          <div class="text-caption text-grey font-weight-medium mb-1">ID Dirección</div>
          <div class="text-body-2">{{ agroecosistema.idDireccion }}</div>
        </v-col>

        <v-col v-if="productos && productos.length" cols="12">
          <v-divider class="my-2"></v-divider>
          <div class="text-caption text-grey font-weight-medium mb-2">Productos Asignados</div>
          <div class="d-flex flex-wrap gap-2">
            <v-chip
              v-for="(prod, i) in productos"
              :key="i"
              size="small"
              variant="outlined"
              color="success"
            >
              {{ prod }}
            </v-chip>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
defineProps({
  agroecosistema: {
    type: Object,
    default: () => ({})
  },
  productos: {
    type: Array,
    default: () => []
  }
})

defineEmits(['close'])
</script>
