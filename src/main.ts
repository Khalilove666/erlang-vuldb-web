import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";
import { createPinia } from "pinia";
// Vuetify
import "vuetify/_styles.scss";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";
import "./styles/main.scss";

const pinia = createPinia();
const vuetify = createVuetify({
  components,
  directives,
});

createApp(App).use(pinia).use(router).use(vuetify).mount("#app");
