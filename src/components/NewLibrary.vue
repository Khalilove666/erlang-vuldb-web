<template>
  <v-dialog v-model="dialog" max-width="600" persistent>
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        variant="outlined"
        prepend-icon="mdi-plus"
        color="info"
        class="text-none"
      >
        <template v-slot:prepend>
          <v-icon color="info"></v-icon>
        </template>
        New Library
      </v-btn>
    </template>

    <v-form ref="form" fast-fail @submit.prevent>
      <v-card prepend-icon="mdi-book" title="New Library">
        <v-card-text>
          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="name"
                variant="outlined"
                density="compact"
                hint="must be unique"
                label="Library name*"
                persistent-hint
                required
                :counter="200"
                :maxlength="200"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="source"
                variant="outlined"
                density="compact"
                hint="must be a valid url"
                label="Source url*"
                persistent-hint
                required
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="description"
                variant="outlined"
                label="Description"
                required
                :rules="[rules.required]"
                hint="Information about the library"
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
            @click="createLibrary()"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, shallowRef } from "vue";
import { useLibrary } from "../composables/useLibrary";
import type { VForm } from "vuetify/components";

const libraryStore = useLibrary();

const form = ref<VForm>();
const dialog = shallowRef(false);
const name = ref("");
const source = ref("");
const description = ref("");
const error = ref<string>();
const loading = ref(false);

async function createLibrary() {
  const fields = await form.value?.validate();
  if (!fields?.valid) return;
  loading.value = true;
  const response = await libraryStore.createLibrary({
    name: name.value,
    source: source.value,
    description: description.value,
  });
  loading.value = false;
  if (!response.success) {
    error.value = response.message;
  } else {
    discard();
    libraryStore.getLibraries();
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
