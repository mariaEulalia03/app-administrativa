<template>
  <v-card class="rounded-lg elevation-2 mx-auto" style="max-width: 800px;">
    <!-- Encabezado / Título principal -->
    <v-card-title
      class="pa-4 pa-sm-6 border-b bg-grey-lighten-5 d-flex flex-column flex-sm-row align-start align-sm-center justify-space-between"
      style="gap: 8px;"
    >
      <div style="min-width: 0; flex: 1;">
        <div class="text-caption text-uppercase font-weight-bold text-grey-darken-1 mb-1">
          Detalle del Alimento
        </div>
        <h1
          class="font-weight-bold text-primary"
          style="font-size: clamp(1.25rem, 4vw, 1.75rem); line-height: 1.2; word-break: break-word; white-space: normal;"
        >
          {{ alimento.nombre || 'Sin nombre' }}
        </h1>
      </div>
      <v-chip
        v-if="alimento.categoria"
        color="primary"
        variant="tonal"
        class="font-weight-bold flex-shrink-0"
        style="white-space: normal; height: auto; min-height: 32px;"
      >
        {{ alimento.categoria }}
      </v-chip>
    </v-card-title>

    <v-card-text class="pa-4 pa-sm-6">
      <!-- Imagen si existe -->
      <v-img
        v-if="alimento.imagen"
        :src="alimento.imagen"
        height="160"
        cover
        class="rounded-lg mb-4 border bg-grey-lighten-4"
      >
        <template #placeholder>
          <div class="d-flex align-center justify-center fill-height bg-grey-lighten-3">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
        </template>
      </v-img>

      <v-row dense>
        <!-- Id -->
        <v-col cols="12" sm="6" md="4">
          <div class="text-caption font-weight-bold text-grey-darken-1">Id</div>
          <div class="text-body-2 text-grey-darken-3" style="word-break: break-all;">{{ alimento.id || '-' }}</div>
        </v-col>

        <!-- Nombre -->
        <v-col cols="12" sm="6" md="4">
          <div class="text-caption font-weight-bold text-grey-darken-1">Nombre</div>
          <div class="text-body-2 font-weight-medium">{{ alimento.nombre || '-' }}</div>
        </v-col>

        <!-- Variedad / Ecotipo -->
        <v-col cols="12" sm="6" md="4">
          <div class="text-caption font-weight-bold text-grey-darken-1">Variedad / Ecotipo</div>
          <div class="text-body-2">{{ alimento.variedad_ecotipo || alimento.tipoVariedad || '-' }}</div>
        </v-col>

        <!-- Nombre Científico -->
        <v-col cols="12" sm="6" md="4">
          <div class="text-caption font-weight-bold text-grey-darken-1">Nombre Científico</div>
          <div class="text-body-2 font-italic">{{ alimento.nombre_cientifico || alimento.nombreCientifico || '-' }}</div>
        </v-col>

        <!-- Nombre en otro idioma -->
        <v-col cols="12" sm="6" md="4">
          <div class="text-caption font-weight-bold text-grey-darken-1">Nombre en otro idioma</div>
          <div class="text-body-2">{{ alimento.nombre_otro_idioma || alimento.otroNombre || '-' }}</div>
        </v-col>

        <!-- Categoría -->
        <v-col cols="12" sm="6" md="4">
          <div class="text-caption font-weight-bold text-grey-darken-1">Categoría</div>
          <div class="text-body-2">{{ alimento.categoria || '-' }}</div>
        </v-col>

        <!-- Procedencia -->
        <v-col cols="12" sm="6" md="4">
          <div class="text-caption font-weight-bold text-grey-darken-1">Procedencia</div>
          <div class="text-body-2">{{ alimento.procedencia || '-' }}</div>
        </v-col>

        <!-- Porción (gramos) -->
        <v-col cols="6" sm="6" md="4">
          <div class="text-caption font-weight-bold text-grey-darken-1">Porción (g)</div>
          <div class="text-body-2">{{ alimento.porcion_gramos || '-' }}</div>
        </v-col>

        <!-- Valor Nutricional Predominante -->
        <v-col cols="6" sm="6" md="4">
          <div class="text-caption font-weight-bold text-grey-darken-1">Valor Nutricional</div>
          <div class="text-body-2">{{ alimento.valor_nutricional_predominante || '-' }}</div>
        </v-col>

        <!-- Forma de Comercialización -->
        <v-col cols="12" sm="6" md="4">
          <div class="text-caption font-weight-bold text-grey-darken-1">Comercialización</div>
          <div class="text-body-2">{{ alimento.forma_comercializacion || alimento.comercializacion || '-' }}</div>
        </v-col>

        <!-- Disponibilidad -->
        <v-col cols="6" sm="6" md="4">
          <div class="text-caption font-weight-bold text-grey-darken-1">Disponibilidad</div>
          <div class="text-body-2">{{ alimento.disponibilidad || '-' }}</div>
        </v-col>

        <!-- Frecuencia de Oferta -->
        <v-col cols="6" sm="6" md="4">
          <div class="text-caption font-weight-bold text-grey-darken-1">Frecuencia de Oferta</div>
          <div class="text-body-2">{{ alimento.frecuencia_oferta || '-' }}</div>
        </v-col>

        <!-- Meses de Disponibilidad -->
        <v-col cols="12">
          <v-divider class="my-2"></v-divider>
          <div class="text-caption font-weight-bold text-grey-darken-1">Meses de Disponibilidad</div>
          <div class="text-body-2 mt-1">{{ alimento.meses_disponibilidad || '-' }}</div>
        </v-col>

        <!-- Descripción Nutricional -->
        <v-col cols="12">
          <div class="text-caption font-weight-bold text-grey-darken-1">Descripción Nutricional</div>
          <div class="text-body-2 mt-1" style="text-align: justify;">{{ alimento.descripcion_nutricional || alimento.descripcionNutricional || '-' }}</div>
        </v-col>

        <!-- Limitaciones Nutricionales -->
        <v-col cols="12">
          <div class="text-caption font-weight-bold text-grey-darken-1">Limitaciones Nutricionales</div>
          <div class="text-body-2 mt-1" style="text-align: justify;">{{ alimento.limitaciones_nutricionales || alimento.limitacionesNutricionales || '-' }}</div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
defineProps({
  alimento: {
    type: Object,
    default: () => ({
      id: '79e41d35',
      imagen: '',
      nombre: 'Huevo de gallina',
      variedad_ecotipo: 'Gallina criolla',
      nombre_cientifico: 'Gallus gallus domesticus',
      nombre_otro_idioma: 'Walpa lulun',
      categoria: 'Producto de origen animal',
      procedencia: 'Tradicional/campesina , Recolección silvestre',
      descripcion_nutricional: 'El huevo de gallina es un alimento de origen animal de alto valor biológico, reconocido por su elevado contenido de proteínas de excelente calidad. Además, aporta grasas, vitaminas liposolubles (A, D y E), vitaminas del complejo B (especialmente B12) y minerales como hierro, fósforo y selenio.',
      limitaciones_nutricionales: 'Contiene colesterol en la yema y carece de fibra dietética. Las personas con alergia al huevo deben evitar su consumo.',
      porcion_gramos: '50 g',
      forma_comercializacion: 'Venta directa en ferias agroecológicas por docena o cubeta.',
      disponibilidad: 'Todo el año',
      meses_disponibilidad: 'Ene, Feb, Mar, Abr, May, Jun, Jul, Ago, Sep, Oct, Nov, Dic',
      frecuencia_oferta: 'Semanal',
      valor_nutricional_predominante: 'Proteínas de alto valor biológico'
    })
  }
})
</script>
