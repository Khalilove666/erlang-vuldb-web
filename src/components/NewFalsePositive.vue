<template>
  <v-dialog v-model="dialog" max-width="800" persistent>
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        variant="outlined"
        prepend-icon="mdi-gesture-tap-button"
        color="info"
        class="text-none mt-2 mt-sm-0 w-100 w-sm-auto"
      >
        <template v-slot:prepend>
          <v-icon color="info"></v-icon>
        </template>
        Report As False Positive
      </v-btn>
    </template>
    <v-form ref="form" fast-fail @submit.prevent>
      <v-card
        prepend-icon="mdi-label-off-outline"
        title="Report As False Positive"
      >
        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <v-textarea
                v-model="description"
                variant="outlined"
                label="Description *"
                required
                :rules="[rules.required]"
              ></v-textarea>
            </v-col>
          </v-row>
          <small class="text-caption text-medium-emphasis"
            >*indicates required field</small
          >
        </v-card-text>
        <v-card-text v-if="error">
          <p class="text-error">{{ error }}</p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text="Discard"
            variant="plain"
            class="text-none"
            @click="discard()"
          ></v-btn>

          <v-btn
            :loading="loading"
            color="primary"
            text="Submit"
            type="submit"
            variant="outlined"
            class="text-none"
            @click="createFalsePositive()"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, shallowRef } from "vue";
import { useFalsePositive } from "../composables/useFalsePositive";
import type { VForm } from "vuetify/components";

const props = defineProps<{
  candidateWorkId: number;
}>();

const falsePositiveStore = useFalsePositive();
const dialog = shallowRef(false);
const error = ref<string>();
const loading = ref(false);
const form = ref<VForm>();

const description = ref<string>();

async function createFalsePositive() {
  const fields = await form.value?.validate();
  if (!fields?.valid) return;
  loading.value = true;
  if (!description.value) return;
  const response = await falsePositiveStore.createFalsePositive(
    props.candidateWorkId,
    {
      description: description.value,
    }
  );
  loading.value = false;
  if (!response.success) {
    error.value = response.message;
  } else {
    discard();
    falsePositiveStore.getFalsePositives(props.candidateWorkId);
  }
}

function discard() {
  dialog.value = false;
  error.value = undefined;
  form.value?.reset();
}

const rules = {
  required: (value: string) => !!value || "Field is required",
};
</script>
