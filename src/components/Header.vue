<template>
  <v-app-bar>
    <!-- color="teal-darken-4" -->
    <!-- image="https://picsum.photos/1920/1080?random" -->
    <template v-slot:image>
      <v-img
        gradient="to top right, rgba(102,102,102,0.2), rgba(169,4,51,0.8)"
      ></v-img>
    </template>

    <template v-slot:prepend>
      <v-app-bar-nav-icon
        color="#00274d"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
    </template>

    <v-app-bar-title>
      <v-avatar>
        <v-img alt="Erlang Logo" src="/logo.webp"></v-img>
      </v-avatar>
      <router-link to="/" class="ms-4 header__title">Erlang VulDB</router-link>
    </v-app-bar-title>

    <v-menu v-if="auth.isAuthenticated">
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props">
          <v-avatar color="#00274d">
            <v-img
              v-if="auth.user?.picture"
              alt="User avatar"
              :src="auth.user?.picture"
            ></v-img>
            <v-icon v-else>mdi-account</v-icon>
          </v-avatar>
        </v-btn>
      </template>
      <v-list density="compact" nav>
        <v-list-item
          value="profilePage"
          color="primary"
          @click="router.push({ path: '/profile' })"
        >
          <template v-slot:prepend>
            <v-icon>mdi-account</v-icon>
          </template>
          <v-list-item-title>{{ auth.user?.name }}</v-list-item-title>
        </v-list-item>
        <v-list-item value="logOut" color="primary" @click="auth.logOutUser()">
          <template v-slot:prepend>
            <v-icon>mdi-logout</v-icon>
          </template>
          <v-list-item-title>Log out</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-btn v-else icon @click="auth.loginUser()">
      <v-avatar>
        <v-icon color="#00274d">mdi-account</v-icon>
      </v-avatar>
    </v-btn>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useAuth0 } from "../composables/useAuth0";
import { inject } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const auth = useAuth0();
const drawer = inject<boolean>("drawer");
</script>
