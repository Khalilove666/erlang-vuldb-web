<template>
  <div class="d-sm-flex justify-space-between">
    <h3>Candidate Work Details</h3>
    <v-chip
      v-if="candidateWork?.false_positive_id"
      class="text-uppercase"
      color="success"
      density="comfortable"
    >
      False Positive
    </v-chip>
  </div>
  <div class="mt-4">
    <div v-if="candidateWork">
      <p>
        File: <span>{{ candidateWork.file }}</span>
      </p>
      <p>
        Complexity: <span>{{ candidateWork.complexity }}</span>
      </p>
      <p>
        Severity: <span>{{ candidateWork.severity }}</span>
      </p>
      <p>
        CWE ID: <span>{{ candidateWork.cwe_ids?.join(", ") }}</span>
      </p>
      <p>
        Type: <span>{{ candidateWork.type }}</span>
      </p>

      <p>
        Lines:
        <span
          >from {{ candidateWork.start_line }} to
          {{ candidateWork.end_line }}</span
        >
      </p>
      <p>
        Position Range:
        <span>{{
          "{" +
          candidateWork.position_range.start.line +
          ", " +
          candidateWork.position_range.start.column +
          "}, {" +
          candidateWork.position_range.end.line +
          ", " +
          candidateWork.position_range.end.column +
          "}"
        }}</span>
      </p>
      <p>
        Library Name:
        <a
          :href="candidateWork.library_version.library?.source"
          target="_blank"
        >
          {{ candidateWork.library_version.library?.name }}
        </a>
      </p>
      <p>
        Main Library Version:
        <span>{{ candidateWork.library_version.version_name }}</span>
      </p>
      <p>
        Other Versions:
        <v-chip
          v-for="version in candidateWork.library_versions"
          :key="version.id"
          density="compact"
        >
          {{ version.version_name }}
        </v-chip>
      </p>
      <p class="mb-4">
        Reporter:
        <v-chip density="compact">{{
          candidateWork.reporter_role == UserRole.RefactorErl
            ? "RefactorErl"
            : "Human"
        }}</v-chip>
      </p>
      <p class="mb-4">
        Created at:
        <span>{{
          new Date(candidateWork.created_at).toLocaleDateString("en-HU")
        }}</span>
      </p>
      <CodeSnippet
        title="Code snippet"
        :code="candidateWork.code_snippet"
        language="erlang"
      />
      <CodeSnippet
        title="Vulnerable Function"
        :code="candidateWork.vulnerable_fun"
        language="erlang"
      />
      <CodeSnippet
        title="Vulnerable MFA"
        :code="candidateWork.vulnerable_mfa"
        language="erlang"
      />
    </div>
  </div>
  <div class="py-10">
    <div class="d-sm-flex justify-space-between">
      <h4>False Positive Reports</h4>
      <NewFalsePositive
        v-if="authStore.isAuthenticated"
        :candidate-work-id="candidateWorkId"
      />
    </div>
    <v-row
      v-if="
        !falsePositiveStore.loading && falsePositiveStore.falsePositives?.length
      "
      class="mt-2"
    >
      <v-col
        v-for="item in falsePositiveStore.falsePositives"
        :key="item.id"
        cols="12"
      >
        <v-card variant="outlined">
          <v-card-item>
            <v-chip
              class="text-capitalize"
              density="comfortable"
              :color="StatusColor[item.status]"
            >
              {{ item.status }}
            </v-chip>
            <p class="mt-4">Description: {{ item.description }}</p>
          </v-card-item>
          <template v-if="authStore.isAdmin()">
            <v-divider />
            <v-card-actions>
              <v-spacer />
              <UpdateFalsePositiveStatusMenu
                :candidate-work-id="candidateWorkId"
                :id="item.id"
              />
              <DeleteFalsePositiveMenu
                :candidate-work-id="candidateWorkId"
                :id="item.id"
              />
            </v-card-actions>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useCandidateWork } from "../composables/useCandidateWork";
import type { CandidateWork } from "../composables/useCandidateWork/types";
import CodeSnippet from "../components/CodeSnippet.vue";
import { UserRole } from "../composables/useCandidateWork/enums";
import { useAuth0 } from "../composables/useAuth0";
import NewFalsePositive from "../components/NewFalsePositive.vue";
import DeleteFalsePositiveMenu from "../components/DeleteFalsePositiveMenu.vue";
import UpdateFalsePositiveStatusMenu from "../components/UpdateFalsePositiveStatusMenu.vue";
import { useFalsePositive } from "../composables/useFalsePositive";
import { FalsePositiveStatus } from "../composables/useFalsePositive/enums";

const router = useRouter();
const route = useRoute();
const authStore = useAuth0();
const candidateWorkStore = useCandidateWork();
const falsePositiveStore = useFalsePositive();
const candidateWorkId = Number(route.params.id as string);
const candidateWork = ref<CandidateWork | null>(null);

const StatusColor = {
  [FalsePositiveStatus.Approved]: "success",
  [FalsePositiveStatus.Rejected]: "error",
  [FalsePositiveStatus.Pending]: "warning",
};
onMounted(async () => {
  const response = await candidateWorkStore.getCandidateWorkDetails(
    candidateWorkId
  );
  if (!response)
    router.push({
      name: "notFound",
      query: {
        message: `Candidate Work with ID: ${candidateWorkId} not found`,
      },
    });
  candidateWork.value = response;
  await falsePositiveStore.getFalsePositives(candidateWorkId);
});
</script>
