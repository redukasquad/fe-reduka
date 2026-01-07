import type { RouteRecordRaw } from "vue-router";
import NotFound from "../pages/NotFound.vue";

export const notfoundRoutes:RouteRecordRaw[]=[
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