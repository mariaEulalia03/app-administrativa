<template>
  <v-card class="rounded-lg elevation-2">
    <v-card-title class="d-flex align-center justify-space-between pa-4 border-b bg-grey-lighten-4">
      <div class="d-flex align-center">
        <v-avatar size="42" color="orange-lighten-4" class="me-3">
          <v-icon color="orange-darken-3">mdi-store</v-icon>
        </v-avatar>
        <div>
          <div class="text-h6 font-weight-bold">{{ feria.nombre || feria.feria }}</div>
          <div class="text-caption text-grey">Feria Agroecológica</div>
        </div>
      </div>
      <v-btn icon="mdi-close" variant="text" size="small" @click="$emit('close')"></v-btn>
    </v-card-title>

    <v-card-text class="pa-6">
      <v-row density="comfortable">
        <v-col cols="12" sm="6">
          <div class="text-caption text-grey font-weight-medium mb-1">ID Feria</div>
          <div class="text-body-1 font-weight-medium">{{ feria.id || feria.idFeria || 'N/A' }}</div>
        </v-col>

        <v-col v-if="feria.entidadControl" cols="12" sm="6">
          <div class="text-caption text-grey font-weight-medium mb-1">Entidad de Control</div>
          <div class="text-body-1">{{ feria.entidadControl }}</div>
        </v-col>

        <v-col v-if="feria.calles" cols="12">
          <div class="text-caption text-grey font-weight-medium mb-1">Dirección</div>
          <div class="d-flex align-center">
            <v-icon size="small" color="error" class="me-1">mdi-map-marker</v-icon>
            <span class="text-body-2">{{ feria.calles }}</span>
          </div>
        </v-col>

        <v-col v-if="feria.horarios && feria.horarios.length" cols="12">
          <v-divider class="my-2"></v-divider>
          <div class="text-caption text-grey font-weight-medium mb-2">Horarios</div>
          <div class="d-flex flex-column gap-1">
            <div
              v-for="h in feria.horarios"
              :key="h.idHorario"
              class="d-flex align-center"
            >
              <v-icon size="x-small" class="me-2 text-grey">mdi-clock-outline</v-icon>
              <span class="text-body-2 font-weight-medium">{{ h.dia }}</span>
              <span class="text-body-2 text-grey ms-2">{{ h.horaApertura }} - {{ h.horaCierre }}</span>
            </div>
          </div>
        </v-col>

        <v-col v-if="feria.redes && feria.redes.length" cols="12" sm="6">
          <v-divider class="my-2"></v-divider>
          <div class="text-caption text-grey font-weight-medium mb-1">Redes</div>
          <v-chip size="small" color="teal-darken-3" variant="tonal">
            {{ feria.redes.length }}
          </v-chip>
        </v-col>

        <v-col v-if="feria.idRelacion" cols="12">
          <v-divider class="my-2"></v-divider>
          <div class="text-caption text-grey font-weight-medium mb-1">ID Relación</div>
          <v-chip size="x-small" color="grey-lighten-2" class="text-grey-darken-3 font-weight-bold">
            {{ feria.idRelacion }}
          </v-chip>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
defineProps({
  feria: {
    type: Object,
    default: () => ({})
  }
})

defineEmits(['close'])
</script>
