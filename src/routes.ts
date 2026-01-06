import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"
import Index from "./pages/Index.vue"
import AuthLayout from "./components/layout/AuthLayout.vue"
import Login from "./pages/auth/login.vue"
import Register from "./pages/auth/register.vue"
import VerifyEmail from "./pages/auth/verify-email.vue"
import ForgotPassword from "./pages/auth/forgot-password.vue"
import ResetPassword from "./pages/auth/reset-password.vue"
import NotFound from "./pages/NotFound.vue"
import Succes from "./pages/auth/google/Succes.vue"


import CoursesIndex from "./pages/courses/index.vue"

import DashboardUser from "./pages/dashboard/user/index.vue"
import DashboardAdmin from "./pages/dashboard/admin/index.vue"
import DashboardTutor from "./pages/dashboard/tutor/index.vue"

import ProgramIndex from "./pages/programs/Index.vue"


import TryoutIndex from "./pages/Tryouts/Index.vue"





const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "landingPage",
    component: Index,
    meta: {
      layout: "default" as const,
      seo: {
        title: "Reduka | Revolusi Edukasi",
        description:
          "Platform pembelajaran untuk membantu Mempersiapkan kamu dalam kebutuhan yang akan datang",
        keywords:
          "AI learning platform, LMS AI, belajar online, tracking belajar",
      },
    },
  },

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
  {
    path: "/courses",
    name: "Courses",
    component:CoursesIndex,
    meta: {
      layout: "default" as const,
      seo: {
        title: "List Courses Pembelajaran yang Tersedia",
        description: "Jelajahi berbagai kelas pembelajaran yang tersedia untuk meningkatkan kemampuan kamu.",
      },
    },
  },
  {
    path: "/programs",
    name: "programs",
    component:ProgramIndex,
    meta: {
      layout: "default" as const,
      seo: {
        title: "Program Pembelajaran Unggulan",
        description: "Temukan program pembelajaran unggulan yang dirancang untuk membantu kamu mencapai tujuan belajar.",
      },
    },
  },
  {
    path: "/tryouts",
    name: "tryouts",
    component:TryoutIndex,
    meta: {
      layout: "default" as const,
      seo: {
        title: "Tryouts untuk Evaluasi Kemampuan",
        description: "Ikuti tryouts kami untuk mengevaluasi kemampuan dan persiapan kamu dalam menghadapi ujian sebenarnya.",
      },
    },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    children: [
      {
        path: "user",
        name: "dashboard-user",
        component: DashboardUser,
        meta: {
          layout: "default" as const,
          seo: {
            title: "Dashboard User",
            description: "Dashboard pengguna.",
          },
        },
      },
      {
        path: "admin",
        name: "dashboard-admin",
        component: DashboardAdmin,
        meta: {
          layout: "default" as const,
          seo: {
            title: "Dashboard Admin",
            description: "Dashboard admin.",
          },
        },
      },
      {
        path: "tutor",
        name: "dashboard-tutor",
        component: DashboardTutor,
        meta: {
          layout: "default" as const,
          seo: {
            title: "Dashboard Tutor",
            description: "Dashboard tutor.",
          },
        },
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: "NotFound",
    component: NotFound,
    meta: {
      layout: "plain" as const,
      seo: {
        title: "404 - Page Not Found",
        description: "Halaman tidak ditemukan.",
        robots: "noindex, follow",
      },
    },
}

]
const router = createRouter({
  history: createWebHistory(),
  routes,
})



const DEFAULT_SEO = {
  title: "Reduka",
  description:
    "Platform modern berbasis AI untuk pembelajaran dan pengembangan skill.",
  keywords: "ai platform, learning platform",
  robots: "index, follow",
}

router.beforeEach((to, _, next) => {
  const seo = to.meta.seo || {}

  const title = seo.title
    ? `${seo.title} | Reduka`
    : DEFAULT_SEO.title

  document.title = title

  setMeta("description", seo.description || DEFAULT_SEO.description)
  setMeta("keywords", seo.keywords || DEFAULT_SEO.keywords)
  setMeta("robots", seo.robots || DEFAULT_SEO.robots)

  // Open Graph
  setMeta("og:title", title, "property")
  setMeta(
    "og:description",
    seo.description || DEFAULT_SEO.description,
    "property"
  )
  setMeta("og:type", "website", "property")
  setMeta("og:url", window.location.href, "property")

  // Twitter
  setMeta("twitter:card", "summary_large_image")
  setMeta("twitter:title", title)
  setMeta(
    "twitter:description",
    seo.description || DEFAULT_SEO.description
  )

  next()
})

/* ======================
   META HELPER
====================== */
function setMeta(
  name: string,
  content: string,
  attr: "name" | "property" = "name"
) {
  let tag = document.querySelector(
    `meta[${attr}="${name}"]`
  ) as HTMLMetaElement | null

  if (!tag) {
    tag = document.createElement("meta")
    tag.setAttribute(attr, name)
    document.head.appendChild(tag)
  }

  tag.setAttribute("content", content)
}

export default router
