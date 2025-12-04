import { createRouter, createWebHistory } from "vue-router";
import Login from "./pages/auth/login.vue";
import Register from "./pages/auth/register.vue";
import Index from "./pages/Index.vue";
import AuthLayout from "./components/layout/AuthLayout.vue";

const routes = [
  {
    path: "/",         
    name: "landingPage",
    component: Index,
  },
  {
    path: "/auth",
    component:AuthLayout,
    children: [
      {
        path: "login",
        name: "login",
        component: Login,
      },
      {
        path: "register",
        name: "register",
        component: Register,
      },
    ],
  }
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
