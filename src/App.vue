<template>
  <v-layout>
    <Drawer />
    <Header />
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-layout>
</template>
<script setup lang="ts">
import { ref, provide } from "vue";
import Header from "./components/Header.vue";
import Drawer from "./components/Drawer.vue";

const drawer = ref(false);
provide("drawer", drawer);
</script>
