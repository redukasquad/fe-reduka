import type { RouteRecordRaw } from "vue-router";
import IndeX from "../pages/courses/Index.vue";
const View = () => import("../pages/courses/View.vue");

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
  {
    path: "/courses/:id",
    name: "courses-view",
    component: View,
    props: true,
    meta: {
      layout: "default" as const,
      seo: {
        title: "Detail Course",
        description: "Lihat detail course dan daftar sekarang.",
      },
    },
  },
]