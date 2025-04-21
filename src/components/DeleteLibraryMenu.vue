<template>
  <v-menu v-model="menu" :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        icon
        prepend-icon="mdi-delete"
        color="error"
        density="compact"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-actions>
        <v-btn
          text="Cancel"
          variant="plain"
          class="text-none"
          @click="menu = false"
        ></v-btn>
        <v-btn
          :loading="loading"
          color="error"
          text="Delete"
          class="text-none"
          variant="outlined"
          @click="deleteLibrary()"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { shallowRef } from "vue";
import { useLibrary } from "../composables/useLibrary";
const props = defineProps<{ libraryId: number }>();
const libraryStore = useLibrary();
const loading = shallowRef(false);
const menu = shallowRef(false);

async function deleteLibrary() {
  loading.value = true;
  const response = await libraryStore.deleteLibrary(props.libraryId);
  loading.value = false;
  menu.value = false;
  if (response.success) libraryStore.getLibraries();
}
</script>
