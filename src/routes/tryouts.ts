import type { RouteRecordRaw } from "vue-router";
import Index from "../pages/tryouts/Index.vue";

export const tryoutsRoutes:RouteRecordRaw[]=[
  {
    path: "/tryouts",
    name: "tryouts",
    component:Index,
    meta: {
      layout: "default" as const,
      seo: {
        title: "Tryouts untuk Evaluasi Kemampuan",
        description: "Ikuti tryouts kami untuk mengevaluasi kemampuan dan persiapan kamu dalam menghadapi ujian sebenarnya.",
      },
    },
  },
]
