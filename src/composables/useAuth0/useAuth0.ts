import { type Auth0Client, createAuth0Client } from "@auth0/auth0-spa-js";
import { defineStore } from "pinia";
import type {
  Auth0State,
  IsAdmin,
  LoadUser,
  LoginUser,
  LogOutUser,
  UseAuth0Return,
} from "./types";
import { reactive, toRefs } from "vue";
import { vulDbClient } from "../../clients/vul_db_client.ts";
import { UserRole } from "../useCandidateWork/enums.ts";

export const useAuth0 = defineStore("auth0", (): UseAuth0Return => {
  const state = reactive<Auth0State>({
    isAuthenticated: false,
    isUserLoaded: false,
    user: undefined,
    token: undefined,
    roles: undefined,
    loading: false,
  });

  let auth0Client: Auth0Client;

  async function createClient() {
    try {
      auth0Client = await createAuth0Client({
        domain: import.meta.env.VITE_AUTH0_DOMAIN,
        clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
        authorizationParams: {
          redirect_uri: window.location.origin,
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: import.meta.env.VITE_AUTH0_SCOPE,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  const loadUser: LoadUser = async () => {
    if (!auth0Client) await createClient();

    let redirectResultedLogin = false;
    const query = window.location.search;
    if (query.includes("code=") && query.includes("state=")) {
      try {
        await auth0Client.handleRedirectCallback();
        redirectResultedLogin = true;
      } catch (error) {
        console.error(error);
      }
    }
    try {
      state.isAuthenticated = await auth0Client.isAuthenticated();
      if (!state.isAuthenticated) return;
      state.token = await auth0Client.getTokenSilently();
      state.user = await auth0Client.getUser();
      const tokenClaims = await auth0Client.getIdTokenClaims();
      state.roles =
        tokenClaims && tokenClaims[import.meta.env.VITE_AUTH0_ROLES];
      state.isUserLoaded = true;
      vulDbClient.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${state.token}`;
      if (!state.user) {
        await logOutUser();
        return;
      }

      if (redirectResultedLogin) {
        // toast.success("Logged in as " + state.user?.name);
        removeQueryParams();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const logOutUser: LogOutUser = async () => {
    vulDbClient.defaults.headers.common["Authorization"] = "";
    state.roles = undefined;
    try {
      await auth0Client.logout({
        logoutParams: {
          returnTo: window.location.origin,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const loginUser: LoginUser = async () => {
    state.loading = true;
    if (!auth0Client) await createClient();
    try {
      await auth0Client.loginWithRedirect();
    } catch (error) {
      console.error(error);
    } finally {
      state.loading = false;
    }
  };

  const removeQueryParams = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("code");
    url.searchParams.delete("state");
    window.history.replaceState({}, document.title, url.pathname + url.search);
  };

  const isAdmin: IsAdmin = () => {
    return state.roles ? state.roles.includes(UserRole.Admin) : false;
  };

  return {
    loginUser,
    loadUser,
    logOutUser,
    isAdmin,
    ...toRefs(state),
  };
});
