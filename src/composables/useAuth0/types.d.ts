import type { Ref } from "vue";
import type { User } from "@auth0/auth0-spa-js";

export interface Auth0State {
  isAuthenticated: boolean;
  isUserLoaded: boolean;
  user: User | undefined;
  token: string | undefined;
  roles: Array<string> | undefined;
  loading: boolean;
}

export type LoginUser = () => Promise<void>;
export type LoadUser = () => Promise<void>;
export type LogOutUser = () => Promise<void>;
export type IsAdmin = () => boolean;

export type UseAuth0Return = {
  isAuthenticated: Readonly<Ref<Auth0State["isAuthenticated"]>>;
  isUserLoaded: Readonly<Ref<Auth0State["isUserLoaded"]>>;
  user: Readonly<Ref<Auth0State["user"]>>;
  token: Readonly<Ref<Auth0State["token"]>>;
  roles: Readonly<Ref<Auth0State["roles"]>>;
  loading: Readonly<Ref<boolean>>;
  loginUser: LoginUser;
  loadUser: LoadUser;
  logOutUser: LogOutUser;
  isAdmin: IsAdmin;
};
