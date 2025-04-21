<template>
  <div>
    <div class="d-sm-flex justify-space-between">
      <h3>Libraries</h3>
      <NewLibrary v-if="authStore.isAdmin()" />
    </div>
    <div v-if="libraryStore.loading" class="d-flex justify-center w-100">
      <v-progress-circular
        indeterminate
        color="#00274d"
        size="40"
      ></v-progress-circular>
    </div>
    <v-row v-if="!libraryStore.loading && libraryStore.libraries" class="mt-4">
      <v-col
        v-for="library in libraryStore.libraries"
        :key="library.id"
        cols="12"
      >
        <v-card variant="outlined" :title="library.name">
          <v-card-item>
            <p>
              Source: <a :href="library.source">{{ library.source }}</a>
            </p>
            <p>Description: {{ library.description }}</p>
            <p>
              Versions:
              <v-chip
                v-for="version in library.library_versions"
                :key="version.id"
                density="compact"
              >
                {{ version.version_name }}
              </v-chip>
            </p>
          </v-card-item>
          <template v-if="authStore.isAdmin()">
            <v-divider />
            <v-card-actions>
              <v-spacer />
              <NewLibraryVersion
                :library-id="library.id"
                :library-name="library.name"
              />
              <DeleteLibraryMenu :library-id="library.id" />
            </v-card-actions>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { useLibrary } from "../composables/useLibrary";
import { useAuth0 } from "../composables/useAuth0";
import NewLibrary from "../components/NewLibrary.vue";
import NewLibraryVersion from "../components/NewLibraryVersion.vue";
import DeleteLibraryMenu from "../components/DeleteLibraryMenu.vue";

const libraryStore = useLibrary();
const authStore = useAuth0();
</script>
