import type { RouteRecordRaw } from "vue-router";
import IndeX from "../pages/courses/Index.vue";

export const coursesRoutes:RouteRecordRaw[]=[
  {
    path: "/courses",
    name: "Courses",
    component:IndeX,
    meta: {
      layout: "default" as const,
      seo: {
        title: "List Courses Pembelajaran yang Tersedia",
        description: "Jelajahi berbagai kelas pembelajaran yang tersedia untuk meningkatkan kemampuan kamu.",
      },
    },
  },
]