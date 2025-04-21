<template>
  <v-menu v-model="menu" :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        prepend-icon="mdi-update"
        color="info"
        density="compact"
      >
        Update Status
      </v-btn>
    </template>
    <v-card :loading="loading">
      <v-card-actions>
        <v-btn
          text="Cancel"
          variant="plain"
          class="text-none"
          @click="menu = false"
        ></v-btn>
        <v-btn
          :disabled="loading"
          color="error"
          prepend-icon="mdi-close"
          text="Reject"
          class="text-none"
          variant="outlined"
          @click="updateFalsePositiveStatus(FalsePositiveStatus.Rejected)"
        ></v-btn>
        <v-btn
          :disabled="loading"
          color="success"
          prepend-icon="mdi-check"
          text="Approve"
          class="text-none"
          variant="outlined"
          @click="updateFalsePositiveStatus(FalsePositiveStatus.Approved)"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { shallowRef } from "vue";
import { useFalsePositive } from "../composables/useFalsePositive";
import { FalsePositiveStatus } from "../composables/useFalsePositive/enums";
const props = defineProps<{ candidateWorkId: number; id: number }>();
const falsePositiveStore = useFalsePositive();
const loading = shallowRef(false);
const menu = shallowRef(false);

async function updateFalsePositiveStatus(status: FalsePositiveStatus) {
  loading.value = true;
  const response = await falsePositiveStore.updateFalsePositiveStatus(
    props.id,
    status
  );
  loading.value = false;
  menu.value = false;
  if (response.success)
    falsePositiveStore.getFalsePositives(props.candidateWorkId);
}
</script>
