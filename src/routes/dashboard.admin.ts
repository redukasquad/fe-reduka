import type { RouteRecordRaw } from "vue-router";
import Index from '../pages/dashboard/admin/index.vue';

const AdminUsersIndex = () => import('../pages/dashboard/admin/users/Index.vue');
const AdminUsersCreate = () => import('../pages/dashboard/admin/users/Create.vue');
const AdminUsersUpdate = () => import('../pages/dashboard/admin/users/Update.vue');

const AdminTutorsIndex = () => import('../pages/dashboard/admin/tutors/Index.vue');
const AdminTutorsCreate = () => import('../pages/dashboard/admin/tutors/Create.vue');
const AdminTutorsUpdate = () => import('../pages/dashboard/admin/tutors/Update.vue');

const AdminCoursesIndex = () => import('../pages/dashboard/admin/courses/Index.vue');
const AdminCoursesCreate = () => import('../pages/dashboard/admin/courses/Create.vue');
const AdminCoursesUpdate = () => import('../pages/dashboard/admin/courses/Update.vue');

const AdminProgramsIndex = () => import('../pages/dashboard/admin/programs/Index.vue');
const AdminProgramsCreate = () => import('../pages/dashboard/admin/programs/Create.vue');
const AdminProgramsUpdate = () => import('../pages/dashboard/admin/programs/Update.vue');

const AdminTryoutsIndex = () => import('../pages/dashboard/admin/tryouts/Index.vue');
const AdminTryoutsCreate = () => import('../pages/dashboard/admin/tryouts/Create.vue');
const AdminTryoutsUpdate = () => import('../pages/dashboard/admin/tryouts/Update.vue');

export const dashboardAdminRoutes: RouteRecordRaw[] = [
  {
    path: "admin",
    name: "dashboard-admin",
    component: Index,
    meta: {
      layout: "default",
      seo: {
        title: "Dashboard Admin",
        description: "Admin dashboard for system management.",
      },
      requiresAuth: true,
      roles: ["ADMIN"],
    },
    children: [
      {
        path: "users",
        name: "admin-users",
        component: AdminUsersIndex,
        meta: { title: "Users" },
        children: [
          {
            path: "create",
            name: "admin-users-create",
            component: AdminUsersCreate,
            meta: { title: "Create User" },
          },
          {
            path: ":id.update", 
            name: "admin-users-update",
            component: AdminUsersUpdate,
            meta: { title: "Edit User" },
            props: true,
          },
        ],
      },
      {
        path: "tutors",
        name: "admin-tutors",
        component: AdminTutorsIndex,
        meta: { title: "Tutors" },
        children: [
          {
            path: "create",
            name: "admin-tutors-create",
            component: AdminTutorsCreate,
            meta: { title: "Create Tutor" },
          },
          {
            path: ":id.update",
            name: "admin-tutors-update",
            component: AdminTutorsUpdate,
            meta: { title: "Edit Tutor" },
            props: true,
          },
        ],
      },

      // Courses
      {
        path: "courses",
        name: "admin-courses",
        component: AdminCoursesIndex,
        meta: { title: "Courses" },
        children: [
          {
            path: "create",
            name: "admin-courses-create",
            component: AdminCoursesCreate,
            meta: { title: "Create Course" },
          },
          {
            path: ":id.update",
            name: "admin-courses-update",
            component: AdminCoursesUpdate,
            meta: { title: "Edit Course" },
            props: true,
          },
        ],
      },

      // Programs
      {
        path: "programs",
        name: "admin-programs",
        component: AdminProgramsIndex,
        meta: { title: "Programs" },
        children: [
          {
            path: "create",
            name: "admin-programs-create",
            component: AdminProgramsCreate,
            meta: { title: "Create Program" },
          },
          {
            path: ":id.update",
            name: "admin-programs-update",
            component: AdminProgramsUpdate,
            meta: { title: "Edit Program" },
            props: true,
          },
        ],
      },

      // Tryouts ✅ sesuai permintaan
      {
        path: "tryouts",
        name: "admin-tryouts",
        component: AdminTryoutsIndex,
        meta: { title: "Tryouts" },
        children: [
          {
            path: "create",
            name: "admin-tryouts-create",
            component: AdminTryoutsCreate,
            meta: { title: "Create Tryout" },
          },
          {
            path: ":id.update", // ✅ /dashboard/admin/tryouts/123.update
            name: "admin-tryouts-update",
            component: AdminTryoutsUpdate,
            meta: { title: "Edit Tryout" },
            props: true,
          },
        ],
      },
    ],
  },
];