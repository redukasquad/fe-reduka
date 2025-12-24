import { createRouter, createWebHistory } from "vue-router";
import Login from "./pages/auth/login.vue";
import Register from "./pages/auth/register.vue";
import Index from "./pages/Index.vue";
import AuthLayout from "./components/layout/AuthLayout.vue";
import ForgotPassword from "./pages/auth/reset-password.vue";
import ResetPassword from "./pages/auth/reset-password.vue";

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
      {
        path:'reset-password',
        name:'reset-password',
        component:ResetPassword
      }
    ],
  }
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
