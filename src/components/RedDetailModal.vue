<template>
  <v-card class="rounded-lg elevation-2">
    <v-card-title class="d-flex align-center justify-space-between pa-4 border-b bg-grey-lighten-4">
      <div class="d-flex align-center">
        <v-avatar size="42" color="teal-lighten-4" class="me-3">
          <v-icon color="teal-darken-3">mdi-hub</v-icon>
        </v-avatar>
        <div>
          <div class="text-h6 font-weight-bold">{{ red.nombre || red.red }}</div>
          <div class="text-caption text-grey">Red</div>
        </div>
      </div>
      <v-btn icon="mdi-close" variant="text" size="small" @click="$emit('close')"></v-btn>
    </v-card-title>

    <v-card-text class="pa-6">
      <v-row density="comfortable">
        <v-col cols="12" sm="6">
          <div class="text-caption text-grey font-weight-medium mb-1">ID Red</div>
          <div class="text-body-1 font-weight-medium">{{ red.id || red.idRed || 'N/A' }}</div>
        </v-col>

        <v-col v-if="red.asociaciones" cols="12" sm="6">
          <div class="text-caption text-grey font-weight-medium mb-1">Asociaciones</div>
          <v-chip size="small" color="teal-darken-3" variant="tonal">
            {{ red.asociaciones.length }}
          </v-chip>
        </v-col>

        <v-col v-if="red.ferias" cols="12" sm="6">
          <div class="text-caption text-grey font-weight-medium mb-1">Ferias</div>
          <v-chip size="small" color="teal-darken-3" variant="tonal">
            {{ red.ferias.length }}
          </v-chip>
        </v-col>

        <v-col v-if="red.idRelacion" cols="12">
          <v-divider class="my-2"></v-divider>
          <div class="text-caption text-grey font-weight-medium mb-1">ID Relación</div>
          <v-chip size="x-small" color="grey-lighten-2" class="text-grey-darken-3 font-weight-bold">
            {{ red.idRelacion }}
          </v-chip>
        </v-col>

        <v-col v-if="red.idRedFeria" cols="12">
          <v-divider class="my-2"></v-divider>
          <div class="text-caption text-grey font-weight-medium mb-1">ID Red-Feria</div>
          <v-chip size="x-small" color="grey-lighten-2" class="text-grey-darken-3 font-weight-bold">
            {{ red.idRedFeria }}
          </v-chip>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
defineProps({
  red: {
    type: Object,
    default: () => ({})
  }
})

defineEmits(['close'])
</script>
