import { createRouter, createWebHistory } from "vue-router";
import Login from "./pages/auth/login.vue";
import Register from "./pages/auth/register.vue";
import Index from "./pages/Index.vue";
import AuthLayout from "./components/layout/AuthLayout.vue";
import ResetPassword from "./pages/auth/reset-password.vue";
import VerifyEmail from "./pages/auth/verify-email.vue";
import ForgotPassword from "./pages/auth/forgot-password.vue";

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
      },
      {
        path:'verify-email',
        name:'verify-email',
        component:VerifyEmail
      },
      {
        path:'forgot-password',
        name:'forgot-password',
        component:ForgotPassword
      }
    ],
  }
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
