import { createRouter, createWebHistory, type RouteLocation } from "vue-router";
import Home from "../pages/Home.vue";
import Profile from "../pages/Profile.vue";
import { useAuth0 } from "../composables/useAuth0";
import CandidateWorks from "../pages/CandidateWorks.vue";
import CandidateWorkDetails from "../pages/CandidateWorkDetails.vue";
import Libraries from "../pages/Libraries.vue";
import NotFound from "../pages/NotFound.vue";
// import { useAuth0 } from "../composables/useAuth0/useAuth0";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: {
      requireAuth: false,
    },
  },
  {
    path: "/profile",
    name: "profile",
    component: Profile,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: "/candidate-works",
    name: "candidateWorks",
    component: CandidateWorks,
  },
  {
    path: "/candidate-works/:id",
    name: "candidateWorkDetails",
    component: CandidateWorkDetails,
  },
  {
    path: "/candidate-works/:id",
    name: "candidateWorkDetails",
    component: CandidateWorkDetails,
  },
  {
    path: "/libraries",
    name: "libraries",
    component: Libraries,
  },
  {
    path: "/libraries/:id",
    name: "libraryDetails",
    component: Libraries,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notFound",
    component: NotFound,
    props: (route: RouteLocation) => ({ message: route.query.message || null }),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const auth = useAuth0();
  if (!auth.isUserLoaded) await auth.loadUser();

  if (to.meta.requireNotAuth && auth.isAuthenticated) {
    return { name: "home" };
  } else if (to.meta.requireAuth && !auth.isAuthenticated) {
    return { name: "home" };
  }
});
