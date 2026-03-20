import type { RouteRecordRaw } from "vue-router";
import Index from "../pages/programs/Index.vue";
const View = () => import("../pages/programs/View.vue");

export const programsRoutes:RouteRecordRaw[]=[
  {
    path: "/programs",
    name: "programs",
    component:Index,
    meta: {
      layout: "default" as const,
      seo: {
        title: "Program Pembelajaran Unggulan",
        description: "Temukan program pembelajaran unggulan yang dirancang untuk membantu kamu mencapai tujuan belajar.",
      },
    },
  },
  {
    path: "/programs/:id",
    name: "programs-view",
    component: View,
    props: true,
    meta: {
      layout: "default" as const,
      seo: {
        title: "Detail Program",
        description: "Lihat detail program pembelajaran dan course yang tersedia.",
      },
    },
  },
]