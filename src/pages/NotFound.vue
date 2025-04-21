<template>
  <div
    class="d-flex flex-column justify-center align-center w-100"
    style="min-height: calc(100vh - 6rem)"
  >
    <h1 class="color_primary">Oops something went wrong</h1>
    <p class="mt-4">{{ message }}</p>
  </div>
</template>
<script setup lang="ts">
defineProps<{ message: string }>();
</script>
