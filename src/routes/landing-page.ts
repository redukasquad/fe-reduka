import type { RouteRecordRaw } from "vue-router";
import Index from "../pages/Index.vue";

export const landingPageRoutes:RouteRecordRaw[]=[
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
]