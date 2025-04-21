<template>
  <div class="d-sm-flex justify-space-between">
    <h3>Candidate Works</h3>
    <NewCandidateWork v-if="authStore.isAuthenticated" />
  </div>
  <div class="v-row mt-4">
    <div class="v-col-12 v-col-md-4 v-col-xl-2">
      <v-autocomplete
        v-if="libraryStore.libraries"
        v-model="selectedLibraryId"
        :items="libraryStore.libraries"
        item-title="name"
        item-value="id"
        label="Library"
        clearable
        chips
        variant="outlined"
        density="compact"
        @update:model-value="triggerNewSearch()"
      />
      <v-radio-group
        v-model="severity"
        label="Severity"
        density="compact"
        @update:model-value="triggerNewSearch()"
      >
        <v-radio label="Any" value="any"></v-radio>
        <v-radio
          label="Not Specified"
          :value="CandidateWorkSeverity.NotSpecified"
        ></v-radio>
        <v-radio
          label="Low"
          :value="CandidateWorkSeverity.Low"
          color="orange"
        ></v-radio>
        <v-radio
          label="Medium"
          :value="CandidateWorkSeverity.Medium"
          color="orange-darken-3"
        ></v-radio>
        <v-radio
          label="High"
          :value="CandidateWorkSeverity.High"
          color="red"
        ></v-radio>
      </v-radio-group>
      <v-radio-group
        v-model="reporter"
        label="Reporter"
        density="compact"
        @update:model-value="triggerNewSearch()"
      >
        <v-radio label="Any" value="any"></v-radio>
        <v-radio label="RefactorErl" :value="UserRole.RefactorErl"></v-radio>
        <v-radio label="Human" :value="UserRole.User"></v-radio>
      </v-radio-group>
    </div>
    <div class="v-col-12 v-col-md-8 v-col-xl-10">
      <div
        v-if="candidateWorkStore.loading"
        class="d-flex justify-center w-100"
      >
        <v-progress-circular
          indeterminate
          color="#00274d"
          size="40"
        ></v-progress-circular>
      </div>
      <div
        v-if="!candidateWorkStore.loading && candidateWorkStore.candidateWorks"
      >
        <v-row>
          <v-col
            v-for="candidateWork in candidateWorkStore.candidateWorks"
            :key="candidateWork.id"
            cols="12"
          >
            <v-card
              variant="outlined"
              style="
                background: linear-gradient(
                  to top right,
                  rgba(102, 102, 102, 0.2),
                  rgba(169, 4, 51, 0.3)
                );
              "
              :title="
                candidateWork.library_version.library?.name +
                ':' +
                candidateWork.file
              "
              :to="'/candidate-works/' + candidateWork.id"
            >
              <v-card-item>
                <p>Vulnerable Function: {{ candidateWork.vulnerable_fun }}</p>
                <p>Vulnerable MFA: {{ candidateWork.vulnerable_mfa }}</p>
                <p>
                  File: <span>{{ candidateWork.file }}</span>
                </p>
                <p>
                  Library Versions:
                  <v-chip
                    v-for="version in candidateWork.library_versions"
                    :key="version.id"
                    density="compact"
                  >
                    {{ version.version_name }}
                  </v-chip>
                </p>
                <p>
                  Reporter:
                  <v-chip>{{
                    candidateWork.reporter_role == UserRole.RefactorErl
                      ? "RefactorErl"
                      : "Human"
                  }}</v-chip>
                </p>
              </v-card-item>
            </v-card>
          </v-col>
        </v-row>
        <div class="d-flex flex-column align-center gap-4 mt-2">
          <v-pagination
            v-if="candidateWorkStore.candidateWorks.length > 0"
            variant="outlined"
            density="compact"
            v-model="currentPage"
            :length="totalPages"
            total-visible="7"
            prev-icon="mdi-chevron-left"
            next-icon="mdi-chevron-right"
            @update:model-value="onPageChange"
          />
          <div v-else class="d-flex flex-column align-center gap-2">
            <v-icon>mdi-emoticon-dead</v-icon>
            <p>Wow, such empty</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from "vue";
import { useCandidateWork } from "../composables/useCandidateWork";
import {
  CandidateWorkSeverity,
  UserRole,
} from "../composables/useCandidateWork/enums";
import { useLibrary } from "../composables/useLibrary";
import { useAuth0 } from "../composables/useAuth0";
import NewCandidateWork from "../components/NewCandidateWork.vue";

const authStore = useAuth0();
const candidateWorkStore = useCandidateWork();
const libraryStore = useLibrary();

const selectedLibraryId = ref<number>();
const type = ref<string>();
const severity = ref<CandidateWorkSeverity | "any">("any");
const reporter = ref<UserRole | "any">("any");
const currentPage = ref<number>(1);
const pageSize = ref<number>(20);

const total = ref(0); // Set this after fetching data

const totalPages = computed(() => Math.ceil(total.value / pageSize.value));

watch([currentPage, pageSize], () => {
  fetchCandidateWorks();
});
onMounted(() => {
  fetchCandidateWorks();
});

function onPageChange(newPage: number) {
  currentPage.value = newPage;
}

function triggerNewSearch() {
  currentPage.value = 1;
  fetchCandidateWorks();
}

async function fetchCandidateWorks() {
  const response = await candidateWorkStore.getCandidateWorks({
    library_id: selectedLibraryId.value,
    type: type.value,
    severity: severity.value != "any" ? severity.value : undefined,
    reporter: reporter.value != "any" ? reporter.value : undefined,
    page_size: pageSize.value,
    current_page: currentPage.value,
  });
  if (!response) return;
  total.value = response?.total;
}
</script>
