import Vue from "vue";
import VueRouter from "vue-router";
import { isAuthenticated } from "@/utils/authUtil";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: { name: "LoginPage" },
  },
  {
    path: "/login",
    name: "LoginPage",
    meta: { forNotAuth: true },
    component: () =>
      import(/* webpackChunkName: "LoginPage" */ "../views/LoginPage.vue"),
  },
  {
    path: "/graph",
    name: "GraphPage",
    meta: { requireAuth: true },
    component: () =>
      import(/* webpackChunkName: "LoginPage" */ "../views/GraphPage.vue"),
  },
  {
    path: "*",
    name: "404",
    component: () => import("@/views/404Error.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const isUserAuthenticated = isAuthenticated();
  if (to.meta.requireAuth && !isUserAuthenticated) {
    next("/");
  } else if (to.meta.forNotAuth && isUserAuthenticated) {
    next({ name: "GraphPage" });
  } else {
    next();
  }
});

export default router;
