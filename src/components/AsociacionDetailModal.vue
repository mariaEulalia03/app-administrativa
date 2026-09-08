<template>
  <v-card class="rounded-lg elevation-2">
    <v-card-title class="d-flex align-center justify-space-between pa-4 border-b bg-grey-lighten-4">
      <div class="d-flex align-center">
        <v-avatar size="42" color="primary-lighten-4" class="me-3">
          <v-icon color="primary">mdi-account-group</v-icon>
        </v-avatar>
        <div>
          <div class="text-h6 font-weight-bold">{{ asociacion.nombre || asociacion.asociacion }}</div>
          <div class="text-caption text-grey">Asociación</div>
        </div>
      </div>
      <v-btn icon="mdi-close" variant="text" size="small" @click="$emit('close')"></v-btn>
    </v-card-title>

    <v-card-text class="pa-6">
      <v-row density="comfortable">
        <v-col cols="12" sm="6">
          <div class="text-caption text-grey font-weight-medium mb-1">ID Asociación</div>
          <div class="text-body-1 font-weight-medium">
            {{ asociacion.id || asociacion.idAsociacion || 'N/A' }}
          </div>
        </v-col>

        <v-col v-if="asociacion.productores" cols="12" sm="6">
          <div class="text-caption text-grey font-weight-medium mb-1">Productores Asociados</div>
          <v-chip size="small" color="primary" variant="tonal">
            {{ asociacion.productores.length }}
          </v-chip>
        </v-col>

        <v-col v-if="asociacion.redes" cols="12" sm="6">
          <div class="text-caption text-grey font-weight-medium mb-1">Redes Vinculadas</div>
          <v-chip size="small" color="teal-darken-3" variant="tonal">
            {{ asociacion.redes.length }}
          </v-chip>
        </v-col>

        <v-col v-if="asociacion.productos && asociacion.productos.length" cols="12">
          <v-divider class="my-2"></v-divider>
          <div class="text-caption text-grey font-weight-medium mb-2">Productos</div>
          <div class="d-flex flex-wrap gap-2">
            <v-chip
              v-for="(prod, i) in asociacion.productos"
              :key="i"
              size="small"
              variant="outlined"
              color="primary"
            >
              {{ prod }}
            </v-chip>
          </div>
        </v-col>

        <v-col v-if="asociacion.idRelacion" cols="12">
          <v-divider class="my-2"></v-divider>
          <div class="text-caption text-grey font-weight-medium mb-1">ID Relación</div>
          <v-chip size="x-small" color="grey-lighten-2" class="text-grey-darken-3 font-weight-bold">
            {{ asociacion.idRelacion }}
          </v-chip>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
defineProps({
  asociacion: {
    type: Object,
    default: () => ({})
  }
})

defineEmits(['close'])
</script>
