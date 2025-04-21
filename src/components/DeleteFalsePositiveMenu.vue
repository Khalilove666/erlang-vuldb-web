<template>
  <v-menu v-model="menu" :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" icon color="error" density="compact">
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
          @click="deleteFalsePositive()"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { shallowRef } from "vue";
import { useFalsePositive } from "../composables/useFalsePositive";
const props = defineProps<{ candidateWorkId: number; id: number }>();
const falsePositiveStore = useFalsePositive();
const loading = shallowRef(false);
const menu = shallowRef(false);

async function deleteFalsePositive() {
  loading.value = true;
  const response = await falsePositiveStore.deleteFalsePositive(props.id);
  loading.value = false;
  menu.value = false;
  if (response.success)
    falsePositiveStore.getFalsePositives(props.candidateWorkId);
}
</script>
