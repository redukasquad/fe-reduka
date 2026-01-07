import type { RouteRecordRaw } from "vue-router";
import AuthLayout from "../components/layout/AuthLayout.vue";
import Login from "../pages/auth/login.vue";
import Register from "../pages/auth/register.vue";
import VerifyEmail from "../pages/auth/verify-email.vue";
import ForgotPassword from "../pages/auth/forgot-password.vue";
import ResetPassword from "../pages/auth/reset-password.vue";
import Succes from "../pages/auth/google/Succes.vue";

export const authRoutes:RouteRecordRaw[]=[
  {
    path: "/auth",
    component: AuthLayout,
    meta: {
      layout: "auth" as const,
    },
    children: [
      {
        path: "login",
        name: "login",
        component: Login,
        meta: {
          seo: {
            title: "Login",
            description: "Masuk ke akun kamu untuk melanjutkan pembelajaran.",
            robots: "noindex, nofollow",
          },
        },
      },
      {
        path: "register",
        name: "register",
        component: Register,
        meta: {
          seo: {
            title: "Register",
            description:
              "Daftar akun baru dan mulai belajar dengan bantuan AI.",
            robots: "noindex, nofollow",
          },
        },
      },
      {
        path: "verify-email",
        name: "verify-email",
        component: VerifyEmail,
        meta: {
          seo: {
            title: "Verify Email",
            description: "Verifikasi email untuk mengaktifkan akun.",
            robots: "noindex, nofollow",
          },
        },
      },
      {
        path: "forgot-password",
        name: "forgot-password",
        component: ForgotPassword,
        meta: {
          seo: {
            title: "Forgot Password",
            description: "Reset password akun kamu dengan aman.",
            robots: "noindex, nofollow",
          },
        },
      },
      {
        path: "reset-password",
        name: "reset-password",
        component: ResetPassword,
        meta: {
          seo: {
            title: "Reset Password",
            description: "Atur ulang password akun kamu.",
            robots: "noindex, nofollow",
          },
        },
      },
      {
        path:'google',
        name:'google-login',
        children:[
          {
            path:'success',
            name:'success',
            component:Succes
          },
          {
            path:'error',
            name:'error',
            component:Succes
          },
        ]
      }
    ],
  },
]