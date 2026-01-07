import type { RouteRecordRaw } from "vue-router";
import Index from '../pages/dashboard/user/index.vue'

export const dashboardUserRoutes:RouteRecordRaw[]=[
    {
    path: "user",
    name: "dashboard-user",
    component: Index,
    meta: {
            layout: "default" as const,
            seo: {
                title: "Dashboard User",
                description: "Dashboard pengguna.",
            },
            roles: ['STUDENT'],
            requiresAuth: true,
        },
    },
]
