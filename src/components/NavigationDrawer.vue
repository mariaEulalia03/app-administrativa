<template>
  <v-navigation-drawer expand-on-hover rail>
    <v-list>
      <v-list-item
        :prepend-avatar="user.avatar"
        :title="user.nombre"
        :subtitle="user.email"
      ></v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-account-group" title="Productores" to="/productores" value="productores"></v-list-item>
      <v-list-item prepend-icon="mdi-domain" title="Asociaciones" to="/asociaciones" value="asociaciones"></v-list-item>
      <v-list-item prepend-icon="mdi-share-variant" title="Redes" to="/redes" value="redes"></v-list-item>
      <v-list-item prepend-icon="mdi-storefront" title="Ferias" to="/ferias" value="ferias"></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { dbService } from '@/services/db.service'
import type { User } from '@/types'

const user = ref<User>({
  id: 0,
  nombre: '',
  email: '',
  avatar: '',
  rol: ''
})

onMounted(async () => {
  user.value = await dbService.getUser()
})
</script>
