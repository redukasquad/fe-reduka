import type { RouteRecordRaw } from "vue-router";
import Index from "../pages/programs/Index.vue";

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
]