import type { RouteRecordRaw } from "vue-router";
import { dashboardAdminRoutes } from "./dashboard.admin";
import { dashboardUserRoutes } from "./dashboard.user";
import { dashboardTutorRoutes } from "./dashboard.tutor";

export const dashboardRoutes:RouteRecordRaw[]=[
  {
    path: "/dashboard",
    name: "dashboard",
    children: [
        ...dashboardAdminRoutes,
        ...dashboardUserRoutes,
        ...dashboardTutorRoutes
    ]
  },
]
