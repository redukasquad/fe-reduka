import type { RouteRecordRaw } from "vue-router";
import Index from "../pages/dashboard/tutor/Index.vue";
import type { RouteMeta } from "vue-router";

// ===== COURSES =====
const TutorCoursesIndex = () =>
  import("../pages/dashboard/tutor/courses/index.vue");


// ===== TRYOUTS =====
const TutorTryoutsIndex = () =>
  import("../pages/dashboard/tutor/tryouts/index.vue");

const tutorMeta = {
  layout: "default" as const,
  requiresAuth: true,
  roles: ["TUTOR"],
} as RouteMeta;

export const dashboardTutorRoutes: RouteRecordRaw[] = [
  // ===== DASHBOARD =====
  {
    path: "/dashboard/tutor",
    name: "dashboard-tutor",
    component: Index,
    meta: {
      ...tutorMeta,
      seo: {
        title: "Dashboard Tutor",
        description: "Tutor dashboard.",
      },
    },
  },

  // ===== COURSES =====
  {
    path: "/dashboard/tutor/courses",
    name: "tutor-courses",
    component: TutorCoursesIndex,
    meta: { ...tutorMeta, title: "My Courses" },
  },

  // ===== TRYOUTS =====
  {
    path: "/dashboard/tutor/tryouts",
    name: "tutor-tryouts",
    component: TutorTryoutsIndex,
    meta: { ...tutorMeta, title: "My Tryouts" },
  },
];