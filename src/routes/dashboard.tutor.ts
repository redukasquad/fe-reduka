import type { RouteRecordRaw } from "vue-router";
import Index from '../pages/dashboard/tutor/Index.vue'


export const dashboardTutorRoutes:RouteRecordRaw[]=[
    {
        path: "tutor",
        name: "dashboard-tutor",
        component: Index,
        meta: {
            layout: "default" as const,
            seo: {
                title: "Dashboard Tutor",
                description: "Dashboard tutor.",
            },
            roles: ['TUTOR'],
            requiresAuth: true,
        },
    }
]
