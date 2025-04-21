<template>
  <v-navigation-drawer v-model="drawer" temporary location="start">
    <v-list density="compact" nav color="primary">
      <v-list-item
        prepend-icon="mdi-file-document-multiple"
        to="/candidate-works"
        >Candidate Works
      </v-list-item>
      <v-list-item prepend-icon="mdi-book-multiple" to="/libraries"
        >Libraries
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { inject } from "vue";

const drawer = inject<boolean>("drawer");
</script>
