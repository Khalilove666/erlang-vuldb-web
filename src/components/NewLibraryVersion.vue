<template>
  <v-dialog v-model="dialog" max-width="600" persistent>
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        variant="outlined"
        density="compact"
        prepend-icon="mdi-plus"
        color="info"
        class="text-none"
      >
        <template v-slot:prepend>
          <v-icon color="info"></v-icon>
        </template>
        new version
      </v-btn>
    </template>
    <v-form ref="form" fast-fail @submit.prevent>
      <v-card prepend-icon="mdi-tag" :title="libraryName">
        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="name"
                variant="outlined"
                density="compact"
                hint="must be unique for library"
                label="Library version name*"
                persistent-hint
                required
                :counter="200"
                :maxlength="200"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
          </v-row>
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
            @click="createLibraryVersion()"
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

const props = defineProps<{ libraryId: number; libraryName: string }>();

const libraryStore = useLibrary();

const form = ref<VForm>();
const dialog = shallowRef(false);
const name = ref("");
const error = ref<string>();
const loading = ref(false);

async function createLibraryVersion() {
  const fields = await form.value?.validate();
  if (!fields?.valid) return;
  loading.value = true;
  const response = await libraryStore.createLibraryVersion(props.libraryId, {
    version_name: name.value,
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
