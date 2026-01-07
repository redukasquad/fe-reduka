import type { RouteRecordRaw } from "vue-router";
import Index from "../pages/dashboard/admin/courses/Index.vue";

export const coursesRoutes:RouteRecordRaw[]=[
  {
    path: "/courses",
    name: "Courses",
    component:Index,
    meta: {
      layout: "default" as const,
      seo: {
        title: "List Courses Pembelajaran yang Tersedia",
        description: "Jelajahi berbagai kelas pembelajaran yang tersedia untuk meningkatkan kemampuan kamu.",
      },
    },
  },
]