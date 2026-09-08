<template>
  <v-card class="rounded-lg elevation-1 max-width-800 mx-auto">
    <!-- Encabezado / Título principal -->
    <v-card-title class="pa-6 border-b bg-grey-lighten-5">
      <div class="text-caption text-uppercase font-weight-bold text-grey-darken-1 mb-1">
        Detalle del Alimento
      </div>
      <h1 class="text-h4 font-weight-bold color-primary">
        {{ getVal('nombre', 'Nombre', 'nombre_alimento') }}
      </h1>
    </v-card-title>

    <v-card-text class="pa-6">
      <v-row class="ga-y-4">
        
        <!-- Nombre -->
        <v-col cols="12" sm="6">
          <div class="text-caption font-weight-bold text-grey-darken-1">Nombre</div>
          <div class="text-body-1 font-weight-medium">{{ getVal('nombre', 'Nombre') }}</div>
        </v-col>

        <!-- Id -->
        <v-col cols="12" sm="6">
          <div class="text-caption font-weight-bold text-grey-darken-1">ID</div>
          <div class="text-body-1 text-grey-darken-3">{{ getVal('id', 'ID', '_id') }}</div>
        </v-col>

        <!-- Tipo o Variedad -->
        <v-col cols="12" sm="6">
          <div class="text-caption font-weight-bold text-grey-darken-1">Tipo o Variedad</div>
          <div class="text-body-1">{{ getVal('tipoVariedad', 'variedad', 'variedadEcotipo', 'tipo_variedad') }}</div>
        </v-col>

        <!-- Nombre Científico -->
        <v-col cols="12" sm="6">
          <div class="text-caption font-weight-bold text-grey-darken-1">Nombre Científico</div>
          <div class="text-body-1 font-italic">{{ getVal('nombreCientifico', 'nombre_cientifico') }}</div>
        </v-col>

        <!-- Otro nombre -->
        <v-col cols="12" sm="6">
          <div class="text-caption font-weight-bold text-grey-darken-1">Nombre en otro idioma / Otro nombre</div>
          <div class="text-body-1">{{ getVal('otroNombre', 'nombreOtroIdioma', 'otro_nombre') }}</div>
        </v-col>

        <!-- Categoría -->
        <v-col cols="12" sm="6">
          <div class="text-caption font-weight-bold text-grey-darken-1">Categoría</div>
          <div class="text-body-1">{{ getVal('categoria', 'Categoria') }}</div>
        </v-col>

        <!-- Procedencia -->
        <v-col cols="12" sm="6">
          <div class="text-caption font-weight-bold text-grey-darken-1">Procedencia</div>
          <div class="text-body-1">{{ getVal('procedencia', 'Procedencia') }}</div>
        </v-col>

        <!-- Comercialización -->
        <v-col cols="12" sm="6">
          <div class="text-caption font-weight-bold text-grey-darken-1">Comercialización</div>
          <div class="text-body-1">{{ getVal('comercializacion', 'Comercializacion') }}</div>
        </v-col>

        <!-- Descripción Nutricional -->
        <v-col cols="12">
          <div class="text-caption font-weight-bold text-grey-darken-1">Descripción Nutricional</div>
          <div class="text-body-1 text-justify mt-1">{{ getVal('descripcionNutricional', 'descripcion_nutricional', 'descripcion') }}</div>
        </v-col>

        <!-- Limitaciones Nutricionales -->
        <v-col cols="12">
          <div class="text-caption font-weight-bold text-grey-darken-1">Limitaciones Nutricionales</div>
          <div class="text-body-1 text-justify mt-1">{{ getVal('limitacionesNutricionales', 'limitaciones_nutricionales', 'limitaciones') }}</div>
        </v-col>

        <!-- Acompañamiento tradicional -->
        <v-col cols="12">
          <div class="text-caption font-weight-bold text-grey-darken-1">Acompañamiento tradicional</div>
          <div class="text-body-1">{{ getVal('acompanamientoTradicional', 'acompanamiento_tradicional') }}</div>
        </v-col>

        <!-- Formas de Preparación y Consumo -->
        <v-col cols="12">
          <div class="text-caption font-weight-bold text-grey-darken-1">Formas de Preparación y Consumo</div>
          <div class="text-body-1 text-justify mt-1">{{ getVal('formasPreparacion', 'formas_preparacion', 'preparacion') }}</div>
        </v-col>

        <!-- Propiedades Medicinales -->
        <v-col cols="12">
          <div class="text-caption font-weight-bold text-grey-darken-1">Propiedades Medicinales</div>
          <div class="text-body-1 text-justify mt-1">{{ getVal('propiedadesMedicinales', 'propiedades_medicinales') }}</div>
        </v-col>

        <!-- Precaución o contraindicaciones -->
        <v-col cols="12">
          <div class="text-caption font-weight-bold text-grey-darken-1">Precaución o contraindicaciones</div>
          <div class="text-body-1 text-justify mt-1">{{ getVal('contraindicaciones', 'precaucion_contraindicaciones') }}</div>
        </v-col>

        <!-- Usos Medicinales Frecuentes -->
        <v-col cols="12">
          <div class="text-caption font-weight-bold text-grey-darken-1">Usos Medicinales Frecuentes</div>
          <div class="text-body-1">{{ getVal('usosMedicinales', 'usos_medicinales') }}</div>
        </v-col>

        <!-- Usos No Alimentarios / Agroecológicos -->
        <v-col cols="12">
          <div class="text-caption font-weight-bold text-grey-darken-1">Usos No Alimentarios / Agroecológicos</div>
          <div class="text-body-1">{{ getVal('usosAgroecologicos', 'usos_agroecologicos') }}</div>
        </v-col>

        <!-- Conservación / Almacenamiento -->
        <v-col cols="12">
          <div class="text-caption font-weight-bold text-grey-darken-1">Conservación / Almacenamiento</div>
          <div class="text-body-1">{{ getVal('conservacion', 'almacenamiento') }}</div>
        </v-col>

      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { toRefs } from 'vue'

const props = defineProps({
  alimento: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

// Función auxiliar para buscar el valor probeando múltiples nombres de claves comunes
const getVal = (...keys) => {
  if (!props.alimento) return '-'
  
  for (const key of keys) {
    if (props.alimento[key] !== undefined && props.alimento[key] !== null && props.alimento[key] !== '') {
      return props.alimento[key]
    }
  }
  return '-'
}
</script>
