import type { RouteRecordRaw } from "vue-router";
import Index from "../pages/dashboard/admin/index.vue";
import type { RouteMeta } from "vue-router";

// Users
const AdminUsersIndex = () => import("../pages/dashboard/admin/users/Index.vue");
const AdminUsersCreate = () => import("../pages/dashboard/admin/users/Create.vue");
const AdminUsersUpdate = () => import("../pages/dashboard/admin/users/Update.vue");
const AdminUsersView = () => import("../pages/dashboard/admin/users/View.vue");

// Courses
const AdminCoursesIndex = () => import("../pages/dashboard/admin/courses/Index.vue");
const AdminCoursesCreate = () => import("../pages/dashboard/admin/courses/Create.vue");
const AdminCoursesUpdate = () => import("../pages/dashboard/admin/courses/Update.vue");
const AdminCoursesView = () => import("../pages/dashboard/admin/courses/View.vue");
const AdminCoursesRegistration = () => import("../pages/dashboard/admin/courses/Registration.vue");

// Programs
const AdminProgramsIndex = () => import("../pages/dashboard/admin/programs/Index.vue");
const AdminProgramsCreate = () => import("../pages/dashboard/admin/programs/Create.vue");
const AdminProgramsUpdate = () => import("../pages/dashboard/admin/programs/Update.vue");
const AdminProgramsView = () => import("../pages/dashboard/admin/programs/View.vue");

// Tryouts
const AdminTryoutsIndex = () => import("../pages/dashboard/admin/tryouts/Index.vue");
const AdminTryoutsCreate = () => import("../pages/dashboard/admin/tryouts/Create.vue");
const AdminTryoutsUpdate = () => import("../pages/dashboard/admin/tryouts/Update.vue");
const AdminTryoutsView = () => import("../pages/dashboard/admin/tryouts/View.vue");

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
    path: "/dashboard/admin/users/:id",
    name: "admin-users-view",
    component: AdminUsersView,
    props: true,
    meta: { ...adminMeta, title: "Detail User" },
  },
  {
    path: "/dashboard/admin/users/:id/update",
    name: "admin-users-update",
    component: AdminUsersUpdate,
    props: true,
    meta: { ...adminMeta, title: "Edit User" },
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
    path: "/dashboard/admin/courses/:id",
    name: "admin-courses-view",
    component: AdminCoursesView,
    props: true,
    meta: { ...adminMeta, title: "Detail Course" },
  },
  {
    path: "/dashboard/admin/courses/:id/update",
    name: "admin-courses-update",
    component: AdminCoursesUpdate,
    props: true,
    meta: { ...adminMeta, title: "Edit Course" },
  },
  {
    path: "/dashboard/admin/courses/:id/registrations",
    name: "admin-courses-registration",
    component: AdminCoursesRegistration,
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
    path: "/dashboard/admin/programs/:id",
    name: "admin-programs-view",
    component: AdminProgramsView,
    props: true,
    meta: { ...adminMeta, title: "Detail Program" },
  },
  {
    path: "/dashboard/admin/programs/:id/update",
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
    path: "/dashboard/admin/tryouts/:id",
    name: "admin-tryouts-view",
    component: AdminTryoutsView,
    props: true,
    meta: { ...adminMeta, title: "Detail Tryout" },
  },
  {
    path: "/dashboard/admin/tryouts/:id/update",
    name: "admin-tryouts-update",
    component: AdminTryoutsUpdate,
    props: true,
    meta: { ...adminMeta, title: "Edit Tryout" },
  },
];
