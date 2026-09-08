<template>
  <v-card class="rounded-lg elevation-2">
    <v-card-title class="d-flex align-center justify-space-between pa-4 border-b bg-grey-lighten-4">
      <div class="d-flex align-center">
        <v-avatar size="42" color="teal-lighten-4" class="me-3">
          <v-icon color="teal-darken-3">mdi-hub</v-icon>
        </v-avatar>
        <div>
          <div class="text-h6 font-weight-bold">{{ red.nombre || red.red }}</div>
          <div class="text-caption text-grey">Red Agroecológica</div>
        </div>
      </div>
      <div>
        <v-btn
          v-if="red.id || red.idRed"
          size="small"
          color="primary"
          variant="tonal"
          prepend-icon="mdi-pencil"
          class="me-2 text-none"
          @click="$emit('close'); $router.push(`/redes/${red.id || red.idRed}/editar`)"
        >
          Editar
        </v-btn>
        <v-btn icon="mdi-close" variant="text" size="small" @click="$emit('close')"></v-btn>
      </div>
    </v-card-title>

    <v-card-text class="pa-6">
      <v-row density="comfortable">
        <v-col cols="12">
          <div class="text-caption text-grey font-weight-medium mb-1">ID Red</div>
          <div class="text-body-2 text-grey-darken-2 font-weight-mono mb-2">
            {{ red.id || red.idRed || 'N/A' }}
          </div>
        </v-col>

        <!-- Asociaciones List -->
        <v-col cols="12">
          <v-divider class="my-2"></v-divider>
          <div class="d-flex align-center justify-space-between mb-2">
            <span class="text-subtitle-2 font-weight-bold text-primary">Asociaciones Vinculadas</span>
            <v-chip size="x-small" color="primary" variant="tonal">
              {{ red.asociaciones ? red.asociaciones.length : 0 }}
            </v-chip>
          </div>
          <div v-if="red.asociaciones && red.asociaciones.length" class="d-flex flex-wrap gap-2">
            <v-chip
              v-for="a in red.asociaciones"
              :key="a.idRelacion || a.idAsociacion || a.id"
              size="small"
              color="primary"
              variant="outlined"
              class="ma-1"
              prepend-icon="mdi-account-group"
              style="cursor: pointer"
              @click="$emit('open-asociacion', a.idAsociacion || a.id)"
            >
              {{ a.asociacion || a.nombre }}
            </v-chip>
          </div>
          <div v-else class="text-caption text-grey italic">No hay asociaciones registradas</div>
        </v-col>

        <!-- Ferias List -->
        <v-col cols="12">
          <v-divider class="my-2"></v-divider>
          <div class="d-flex align-center justify-space-between mb-2">
            <span class="text-subtitle-2 font-weight-bold text-orange-darken-3">Ferias Vinculadas</span>
            <v-chip size="x-small" color="orange-darken-3" variant="tonal">
              {{ red.ferias ? red.ferias.length : 0 }}
            </v-chip>
          </div>
          <div v-if="red.ferias && red.ferias.length" class="d-flex flex-wrap gap-2">
            <v-chip
              v-for="f in red.ferias"
              :key="f.idRelacion || f.idFeria || f.id"
              size="small"
              color="orange-darken-3"
              variant="outlined"
              class="ma-1"
              prepend-icon="mdi-store"
              style="cursor: pointer"
              @click="$emit('open-feria', f.idFeria || f.id)"
            >
              {{ f.feria || f.nombre }}
            </v-chip>
          </div>
          <div v-else class="text-caption text-grey italic">No hay ferias registradas</div>
        </v-col>

        <v-col v-if="red.idRelacion" cols="12">
          <v-divider class="my-2"></v-divider>
          <div class="text-caption text-grey font-weight-medium mb-1">ID Relación</div>
          <v-chip size="x-small" color="grey-lighten-2" class="text-grey-darken-3 font-weight-bold">
            {{ red.idRelacion }}
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

defineEmits(['close', 'open-asociacion', 'open-feria'])
</script>
