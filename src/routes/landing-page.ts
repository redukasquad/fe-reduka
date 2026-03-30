import type { RouteRecordRaw } from "vue-router";
import Index from "../pages/Landingpage.vue";
import Contact from "../pages/Contact.vue";

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
  {
    path: "/contact",
    name: "contact",
    component: Contact,
    meta: {
      layout: "default" as const,
      seo: {
        title: "Hubungi Kami",
        description: "Hubungi tim REDUKA untuk pertanyaan, saran, atau bantuan.",
        keywords: "kontak reduka, hubungi kami, customer support",
      },
    },
  },
]