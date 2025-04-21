<template>
  <v-dialog v-model="dialog" max-width="800" persistent>
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
        Report Candidate Work
      </v-btn>
    </template>
    <v-form ref="form" fast-fail @submit.prevent>
      <v-card prepend-icon="mdi-file" title="New Candidate Work">
        <v-card-text>
          <v-row dense>
            <v-col cols="12" sm="6">
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
                @update:model-value="handleSelectLibrary()"
                :rules="[rules.required]"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-autocomplete
                v-model="selectedLibraryVersionId"
                :items="libraryVersions"
                item-title="version_name"
                item-value="id"
                label="Library Version"
                clearable
                chips
                variant="outlined"
                density="compact"
                :rules="[rules.required]"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-autocomplete
                v-model="selectedCweList"
                :items="CWEList"
                item-title="id"
                item-value="id"
                label="CWE IDs"
                multiple
                clearable
                chips
                variant="outlined"
                density="compact"
                :rules="[rules.requiredArray]"
              >
                <template v-slot:item="{ props: itemProps, item }">
                  <v-list-item
                    v-bind="itemProps"
                    :title="'CWE-' + item.raw.id"
                    :subtitle="item.raw.info"
                  ></v-list-item>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="severity"
                clearable
                chips
                density="compact"
                label="Severity"
                :items="severityList"
                variant="outlined"
                :rules="[rules.required]"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="complexity"
                clearable
                chips
                density="compact"
                label="Complexity"
                :items="complexityList"
                variant="outlined"
                :rules="[rules.required]"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-autocomplete
                v-model="type"
                :items="types"
                label="Type"
                clearable
                chips
                variant="outlined"
                density="compact"
                :rules="[rules.required]"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="file"
                variant="outlined"
                density="compact"
                hint="E.g: module/src/file.erl"
                label="File Path *"
                persistent-hint
                required
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="vulnerableMfa"
                variant="outlined"
                density="compact"
                hint="E.g: module:function/1"
                label="Vulnerable MFA *"
                persistent-hint
                required
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="vulnerableFun"
                variant="outlined"
                density="compact"
                hint="E.g: erlang:list_to_atom/1"
                label="Vulnerable Function *"
                persistent-hint
                required
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col cols="12"><p>Position Range</p></v-col>
            <v-col cols="12" sm="3">
              <v-text-field
                v-model="startLine"
                variant="outlined"
                density="compact"
                label="Start line *"
                persistent-hint
                type="number"
                min="1"
                required
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="3">
              <v-text-field
                v-model="startColumn"
                variant="outlined"
                density="compact"
                label="Start column *"
                persistent-hint
                type="number"
                min="1"
                required
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="3">
              <v-text-field
                v-model="endLine"
                variant="outlined"
                density="compact"
                label="End line *"
                persistent-hint
                type="number"
                min="1"
                required
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="3">
              <v-text-field
                v-model="endColumn"
                variant="outlined"
                density="compact"
                label="End column *"
                persistent-hint
                type="number"
                min="1"
                required
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="codeSnippet"
                variant="outlined"
                label="Code snippet *"
                required
                :rules="[rules.required]"
              ></v-textarea>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="codeSnippetStartLine"
                variant="outlined"
                density="compact"
                label="Code snippet start line *"
                persistent-hint
                type="number"
                min="1"
                required
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="codeSnippetEndLine"
                variant="outlined"
                density="compact"
                label="Code snippet end line *"
                persistent-hint
                type="number"
                min="1"
                required
                :rules="[rules.required]"
              ></v-text-field>
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
            @click="createCandidateWork()"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, shallowRef } from "vue";
import { useRouter } from "vue-router";
import { useLibrary } from "../composables/useLibrary";
import { useCandidateWork } from "../composables/useCandidateWork";
import type { LibraryVersion } from "../composables/useLibrary/types";
import {
  CandidateWorkSeverity,
  CandidateWorkComplexity,
} from "../composables/useCandidateWork/enums";
import type { VForm } from "vuetify/components";
import { CWEList } from "../composables/useCwe";

const router = useRouter();
const libraryStore = useLibrary();
const candidateWorkStore = useCandidateWork();
const libraryVersions = ref<Array<LibraryVersion>>([]);
const severityList = ref<Array<CandidateWorkSeverity>>([
  CandidateWorkSeverity.NotSpecified,
  CandidateWorkSeverity.Low,
  CandidateWorkSeverity.Medium,
  CandidateWorkSeverity.High,
]);
const types = ["unsafe_atom", "unsafe_port", "unsafe_communication"];

const complexityList = ref<Array<CandidateWorkComplexity>>([
  CandidateWorkComplexity.NotSpecified,
  CandidateWorkComplexity.Low,
  CandidateWorkComplexity.Medium,
  CandidateWorkComplexity.High,
]);
const dialog = shallowRef(false);
const error = ref<string>();
const loading = ref(false);
const form = ref<VForm>();

const selectedLibraryId = ref<number>();
const selectedLibraryVersionId = ref<number>();
const selectedCweList = ref<Array<number>>([]);
const severity = ref<CandidateWorkSeverity>();
const complexity = ref<CandidateWorkComplexity>();
const type = ref<string>();
const file = ref<string>();
const vulnerableFun = ref<string>();
const vulnerableMfa = ref<string>();
const codeSnippet = ref<string>();
const codeSnippetStartLine = ref<string>("");
const codeSnippetEndLine = ref<string>("");
const startLine = ref<string>("");
const startColumn = ref<string>("");
const endLine = ref<string>("");
const endColumn = ref<string>("");

async function createCandidateWork() {
  const fields = await form.value?.validate();
  if (!fields?.valid) return;
  loading.value = true;
  if (
    !(
      selectedLibraryId.value &&
      selectedLibraryVersionId.value &&
      severity.value &&
      complexity.value &&
      type.value &&
      file.value &&
      vulnerableFun.value &&
      vulnerableMfa.value &&
      codeSnippet.value
    )
  )
    return;
  const response = await candidateWorkStore.createCandidateWork({
    type: type.value,
    file: file.value,
    position_range: {
      start: {
        line: Number(startLine.value),
        column: Number(startColumn.value),
      },
      end: {
        line: Number(endLine.value),
        column: Number(endColumn.value),
      },
    },
    code_snippet: codeSnippet.value,
    start_line: Number(codeSnippetStartLine.value),
    end_line: Number(codeSnippetEndLine.value),
    vulnerable_mfa: vulnerableMfa.value,
    vulnerable_fun: vulnerableFun.value,
    severity: severity.value,
    complexity: complexity.value,
    cwe_ids: selectedCweList.value,
    library_version_id: selectedLibraryVersionId.value,
  });
  loading.value = false;
  if (!response.success) {
    error.value = response.message;
  } else {
    discard();
    router.push("/candidate-works/" + response.work?.id);
  }
}

function discard() {
  dialog.value = false;
  error.value = undefined;
  form.value?.reset();
}

function handleSelectLibrary() {
  const selectedLibrary = libraryStore.libraries?.find(
    (lib) => lib.id === selectedLibraryId.value
  );
  if (selectedLibrary) libraryVersions.value = selectedLibrary.library_versions;
  else libraryVersions.value = [];
  selectedLibraryVersionId.value = undefined;
}

const rules = {
  required: (value: string) => !!value || "Field is required",
  requiredArray: (value: Array<number>) =>
    value.length > 0 || "Field is required",
};
</script>
