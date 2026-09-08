<template>
  <v-app-bar flat border color="white">
    <v-toolbar-title class="font-weight-medium">App Administrativa</v-toolbar-title>
    
    <v-spacer></v-spacer>
    
    <v-text-field
      v-model="internalSearch"
      prepend-inner-icon="mdi-magnify"
      placeholder="Search..."
      variant="solo-filled"
      flat
      density="compact"
      hide-details
      style="max-width: 350px;"
      @update:modelValue="$emit('update:search', $event)"
    ></v-text-field>
    <v-spacer></v-spacer>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  search: {
    type: String,
    default: ''
  }
})

defineEmits(['update:search'])

const internalSearch = ref(props.search)

watch(() => props.search, (newVal) => {
  internalSearch.value = newVal
})
</script>
