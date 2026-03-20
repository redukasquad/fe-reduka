import type { RouteRecordRaw } from "vue-router";
import Index from "../pages/dashboard/tutor/Index.vue";
import type { RouteMeta } from "vue-router";

// ===== COURSES =====
const TutorCoursesIndex = () =>
  import("../pages/dashboard/tutor/courses/index.vue");

const TutorCoursesView = () =>
  import("../pages/dashboard/tutor/courses/View.vue");

const TutorCoursesUpdate = () =>
  import("../pages/dashboard/tutor/courses/Update.vue");

// ===== CLASSES (My Classes — tutor manage sendiri) =====
const TutorClassesIndex = () =>
  import("../pages/dashboard/tutor/classes/index.vue");

const TutorClassesCreate = () =>
  import("../pages/dashboard/tutor/classes/Create.vue");

const TutorClassesView = () =>
  import("../pages/dashboard/tutor/classes/View.vue");



// ===== TRYOUTS =====
const TutorTryoutsIndex = () =>
  import("../pages/dashboard/tutor/tryouts/index.vue");

const TutorTryoutsView = () =>
  import("../pages/dashboard/tutor/tryouts/View.vue");

// ===== PROFILE =====
const TutorProfile = () =>
  import("../pages/dashboard/tutor/profile/index.vue");

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

  // ===== COURSES (read-only) =====
  {
    path: "/dashboard/tutor/courses",
    name: "tutor-courses",
    component: TutorCoursesIndex,
    meta: { ...tutorMeta, title: "Courses" },
  },
  {
    path: "/dashboard/tutor/courses/:id",
    name: "tutor-courses-view",
    component: TutorCoursesView,
    props: true,
    meta: { ...tutorMeta, title: "Detail Course" },
  },
  {
    path: "/dashboard/tutor/courses/:id/update",
    name: "tutor-courses-update",
    component: TutorCoursesUpdate,
    props: true,
    meta: { ...tutorMeta, title: "Edit Course" },
  },

  // ===== CLASSES (tutor manage sendiri) =====
  {
    path: "/dashboard/tutor/classes",
    name: "tutor-classes",
    component: TutorClassesIndex,
    meta: { ...tutorMeta, title: "My Classes" },
  },
  {
    path: "/dashboard/tutor/classes/create",
    name: "tutor-classes-create",
    component: TutorClassesCreate,
    meta: { ...tutorMeta, title: "Buat Class" },
  },
  {
    path: "/dashboard/tutor/classes/:id",
    name: "tutor-classes-view",
    component: TutorClassesView,
    props: true,
    meta: { ...tutorMeta, title: "Kelola Class" },
  },

  // ===== TRYOUTS =====
  {
    path: "/dashboard/tutor/tryouts",
    name: "tutor-tryouts",
    component: TutorTryoutsIndex,
    meta: { ...tutorMeta, title: "My Tryouts" },
  },
  {
    path: "/dashboard/tutor/tryouts/:id",
    name: "tutor-tryouts-view",
    component: TutorTryoutsView,
    meta: { ...tutorMeta, title: "My Tryouts" },
  },

  // ===== PROFILE =====
  {
    path: "/dashboard/tutor/profile",
    name: "tutor-profile",
    component: TutorProfile,
    meta: { ...tutorMeta, title: "Profile" },
  },
];