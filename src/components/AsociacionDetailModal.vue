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
      <div>
        <v-btn
          v-if="asociacion.id || asociacion.idAsociacion"
          size="small"
          color="primary"
          variant="tonal"
          prepend-icon="mdi-pencil"
          class="me-2 text-none"
          @click="$emit('close'); $router.push(`/asociaciones/${asociacion.id || asociacion.idAsociacion}/editar`)"
        >
          Editar
        </v-btn>
        <v-btn icon="mdi-close" variant="text" size="small" @click="$emit('close')"></v-btn>
      </div>
    </v-card-title>

    <v-card-text class="pa-6">
      <v-row density="comfortable">
        <v-col cols="12">
          <div class="text-caption text-grey font-weight-medium mb-1">ID Asociación</div>
          <div class="text-body-2 text-grey-darken-2 font-weight-mono mb-2">
            {{ asociacion.id || asociacion.idAsociacion || 'N/A' }}
          </div>
        </v-col>

        <!-- Productores Asociados List -->
        <v-col cols="12">
          <v-divider class="my-2"></v-divider>
          <div class="d-flex align-center justify-space-between mb-2">
            <span class="text-subtitle-2 font-weight-bold text-primary">Productores Asociados</span>
            <v-chip size="x-small" color="primary" variant="tonal">
              {{ asociacion.productores ? asociacion.productores.length : 0 }}
            </v-chip>
          </div>
          <div v-if="asociacion.productores && asociacion.productores.length" class="d-flex flex-wrap gap-2">
            <v-chip
              v-for="p in asociacion.productores"
              :key="p.id"
              size="small"
              color="primary"
              variant="outlined"
              class="ma-1"
              prepend-icon="mdi-account"
              style="cursor: pointer"
              @click="$emit('open-productor', p.id)"
            >
              {{ p.nombre }}
            </v-chip>
          </div>
          <div v-else class="text-caption text-grey italic">No hay productores registrados</div>
        </v-col>

        <!-- Redes Vinculadas List -->
        <v-col v-if="asociacion.redes && asociacion.redes.length" cols="12">
          <v-divider class="my-2"></v-divider>
          <div class="d-flex align-center justify-space-between mb-2">
            <span class="text-subtitle-2 font-weight-bold text-teal-darken-3">Redes Vinculadas</span>
            <v-chip size="x-small" color="teal-darken-3" variant="tonal">
              {{ asociacion.redes.length }}
            </v-chip>
          </div>
          <div class="d-flex flex-wrap gap-2">
            <v-chip
              v-for="r in asociacion.redes"
              :key="r.id"
              size="small"
              color="teal-darken-3"
              variant="outlined"
              class="ma-1"
              prepend-icon="mdi-hub"
              style="cursor: pointer"
              @click="$emit('open-red', r.id)"
            >
              {{ r.nombre }}
            </v-chip>
          </div>
        </v-col>

        <!-- Ferias Vinculadas List -->
        <v-col v-if="asociacion.ferias && asociacion.ferias.length" cols="12">
          <v-divider class="my-2"></v-divider>
          <div class="d-flex align-center justify-space-between mb-2">
            <span class="text-subtitle-2 font-weight-bold text-orange-darken-3">Ferias Vinculadas</span>
            <v-chip size="x-small" color="orange-darken-3" variant="tonal">
              {{ asociacion.ferias.length }}
            </v-chip>
          </div>
          <div class="d-flex flex-wrap gap-2">
            <v-chip
              v-for="f in asociacion.ferias"
              :key="f.id"
              size="small"
              color="orange-darken-3"
              variant="outlined"
              class="ma-1"
              prepend-icon="mdi-store"
              style="cursor: pointer"
              @click="$emit('open-feria', f.id)"
            >
              {{ f.nombre }}
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

defineEmits(['close', 'open-productor', 'open-red', 'open-feria'])
</script>
