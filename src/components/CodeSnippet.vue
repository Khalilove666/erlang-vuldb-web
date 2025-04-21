<template>
  <div class="code-container mb-4">
    <div
      class="code-container__header d-flex justify-space-between align-center"
    >
      <span class="text-subtitle-2 text-white ms-2">{{ title }}</span>
      <v-btn icon @click="copyToClipboard" size="small" variant="text">
        <v-icon color="white">mdi-content-copy</v-icon>
      </v-btn>
    </div>
    <div v-html="highlightedCode" class="shiki-code" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { createHighlighter } from "shiki";

const props = defineProps<{
  title: string;
  code: string;
  language?: string;
}>();

const highlightedCode = ref("");
const language = props.language || "erlang";

const highlight = async () => {
  const highlighter = await createHighlighter({
    themes: ["night-owl"],
    langs: ["erlang"],
  });
  highlightedCode.value = highlighter.codeToHtml(props.code, {
    lang: language,
    theme: "night-owl",
  });
};

const copyToClipboard = () => {
  navigator.clipboard.writeText(props.code);
};

onMounted(highlight);
watch(() => props.code, highlight);
</script>

<style lang="scss">
.code-container {
  position: relative;
  &__header {
    position: absolute;
    width: 100%;
  }
}
.shiki {
  padding: 1rem;
  padding-top: 2.5rem;
  border-radius: 4px;
  overflow: auto;
}
</style>
