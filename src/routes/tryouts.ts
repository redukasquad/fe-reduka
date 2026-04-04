import type { RouteRecordRaw } from "vue-router";
import Index from "../pages/tryouts/Index.vue";
const View = () => import("../pages/tryouts/View.vue");
const Leaderboard = () => import("../pages/tryouts/Leaderboard.vue");
const ExamIntro = () => import("../pages/tryouts/exam/Intro.vue");
const ExamPage = () => import("../pages/tryouts/exam/Exam.vue");
const ExamResult = () => import("../pages/tryouts/exam/Result.vue");
const SubtestReview = () => import("../pages/tryouts/exam/SubtestReview.vue");

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
  {
    path: "/tryouts/:id",
    name: "tryouts-view",
    component: View,
    props: true,
    meta: {
      layout: "default" as const,
      seo: {
        title: "Detail Tryout",
        description: "Lihat detail tryout dan daftar sekarang.",
      },
    },
  },
  {
    path: "/tryouts/:id/leaderboard",
    name: "tryouts-leaderboard",
    component: Leaderboard,
    props: true,
    meta: {
      layout: "default" as const,
      requiresAuth: true,
      seo: {
        title: "Leaderboard Tryout",
        description: "Lihat peringkat peserta tryout.",
      },
    },
  },
  // Exam flow — no layout wrapper (full screen)
  {
    path: "/tryouts/exam/:registrationId",
    name: "exam-intro",
    component: ExamIntro,
    meta: { layout:'plain',requiresAuth: true, roles: ['STUDENT'] },
  },
  {
    path: "/tryouts/exam/:registrationId/attempt/:attemptId",
    name: "exam-page",
    component: ExamPage,
    meta: { layout:'plain',requiresAuth: true, roles: ['STUDENT'] },
  },
  {
    path: "/tryouts/exam/:registrationId/result/:attemptId",
    name: "exam-result",
    component: ExamResult,
    meta: { layout:'plain', requiresAuth: true, roles: ['STUDENT'] },
  },
  {
    path: "/tryouts/exam/:registrationId/result/:attemptId/review/:subtestId",
    name: "exam-subtest-review",
    component: SubtestReview,
    meta: { layout:'plain', requiresAuth: true, roles: ['STUDENT'] },
  },
]
