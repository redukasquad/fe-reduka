import type { RouteRecordRaw } from "vue-router";
import Index from "../pages/dashboard/admin/index.vue";
import type { RouteMeta } from "vue-router";

// Users
const AdminUsersIndex = () => import("../pages/dashboard/admin/users/Index.vue");
const AdminUsersCreate = () => import("../pages/dashboard/admin/users/Create.vue");
const AdminUsersUpdate = () => import("../pages/dashboard/admin/users/Update.vue");

// Tutors
const AdminTutorsIndex = () => import("../pages/dashboard/admin/tutors/Index.vue");
const AdminTutorsCreate = () => import("../pages/dashboard/admin/tutors/Create.vue");
const AdminTutorsUpdate = () => import("../pages/dashboard/admin/tutors/Update.vue");

// Courses
const AdminCoursesIndex = () => import("../pages/dashboard/admin/courses/Index.vue");
const AdminCoursesCreate = () => import("../pages/dashboard/admin/courses/Create.vue");
const AdminCoursesUpdate = () => import("../pages/dashboard/admin/courses/Update.vue");

// Programs
const AdminProgramsIndex = () => import("../pages/dashboard/admin/programs/Index.vue");
const AdminProgramsCreate = () => import("../pages/dashboard/admin/programs/Create.vue");
const AdminProgramsUpdate = () => import("../pages/dashboard/admin/programs/Update.vue");

// Tryouts
const AdminTryoutsIndex = () => import("../pages/dashboard/admin/tryouts/Index.vue");
const AdminTryoutsCreate = () => import("../pages/dashboard/admin/tryouts/Create.vue");
const AdminTryoutsUpdate = () => import("../pages/dashboard/admin/tryouts/Update.vue");

const adminMeta = {
  layout: "default",
  requiresAuth: true,
  roles: ["ADMIN"],
} as RouteMeta;

export const dashboardAdminRoutes: RouteRecordRaw[] = [
  {
    path: "/dashboard/admin",
    name: "dashboard-admin",
    component: Index,
    meta: {
      ...adminMeta,
      seo: {
        title: "Dashboard Admin",
        description: "Admin dashboard for system management.",
      },
    },
  },

  // ================= USERS =================
  {
    path: "/dashboard/admin/users",
    name: "admin-users",
    component: AdminUsersIndex,
    meta: { ...adminMeta, title: "Users" },
  },
  {
    path: "/dashboard/admin/users/create",
    name: "admin-users-create",
    component: AdminUsersCreate,
    meta: { ...adminMeta, title: "Create User" },
  },
  {
    path: "/dashboard/admin/users/:id.update",
    name: "admin-users-update",
    component: AdminUsersUpdate,
    props: true,
    meta: { ...adminMeta, title: "Edit User" },
  },

  // ================= TUTORS =================
  {
    path: "/dashboard/admin/tutors",
    name: "admin-tutors",
    component: AdminTutorsIndex,
    meta: { ...adminMeta, title: "Tutors" },
  },
  {
    path: "/dashboard/admin/tutors/create",
    name: "admin-tutors-create",
    component: AdminTutorsCreate,
    meta: { ...adminMeta, title: "Create Tutor" },
  },
  {
    path: "/dashboard/admin/tutors/:id.update",
    name: "admin-tutors-update",
    component: AdminTutorsUpdate,
    props: true,
    meta: { ...adminMeta, title: "Edit Tutor" },
  },

  // ================= COURSES =================
  {
    path: "/dashboard/admin/courses",
    name: "admin-courses",
    component: AdminCoursesIndex,
    meta: { ...adminMeta, title: "Courses" },
  },
  {
    path: "/dashboard/admin/courses/create",
    name: "admin-courses-create",
    component: AdminCoursesCreate,
    meta: { ...adminMeta, title: "Create Course" },
  },
  {
    path: "/dashboard/admin/courses/:id.update",
    name: "admin-courses-update",
    component: AdminCoursesUpdate,
    props: true,
    meta: { ...adminMeta, title: "Edit Course" },
  },

  // ================= PROGRAMS =================
  {
    path: "/dashboard/admin/programs",
    name: "admin-programs",
    component: AdminProgramsIndex,
    meta: { ...adminMeta, title: "Programs" },
  },
  {
    path: "/dashboard/admin/programs/create",
    name: "admin-programs-create",
    component: AdminProgramsCreate,
    meta: { ...adminMeta, title: "Create Program" },
  },
  {
    path: "/dashboard/admin/programs/:id.update",
    name: "admin-programs-update",
    component: AdminProgramsUpdate,
    props: true,
    meta: { ...adminMeta, title: "Edit Program" },
  },

  // ================= TRYOUTS =================
  {
    path: "/dashboard/admin/tryouts",
    name: "admin-tryouts",
    component: AdminTryoutsIndex,
    meta: { ...adminMeta, title: "Tryouts" },
  },
  {
    path: "/dashboard/admin/tryouts/create",
    name: "admin-tryouts-create",
    component: AdminTryoutsCreate,
    meta: { ...adminMeta, title: "Create Tryout" },
  },
  {
    path: "/dashboard/admin/tryouts/:id.update",
    name: "admin-tryouts-update",
    component: AdminTryoutsUpdate,
    props: true,
    meta: { ...adminMeta, title: "Edit Tryout" },
  },
];
