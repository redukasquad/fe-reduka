<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { Icon } from '@iconify/vue'
import { TryoutAttemptService } from '../../../services/tryout.attempt'
import { useAuth } from '../../../stores/auth'
import LeaderboardPanel from '../../../components/exam/LeaderboardPanel.vue'

const route = useRoute()
const router = useRouter()
const auth = useAuth()

const regId = Number(route.params.registrationId)
const attemptId = Number(route.params.attemptId)

const currentUserId = computed(() => auth.user?.ID ?? auth.user?.id)

const { data, isLoading, isError } = useQuery({
  queryKey: ['attempt-results', attemptId],
  queryFn: () => TryoutAttemptService.getResults(attemptId),
  retry: 1,
})

const attempt = computed(() => data.value?.data ?? null)
const results = computed(() => attempt.value?.subtestResults ?? [])
const totalScore = computed(() => attempt.value?.totalScore ?? 0)
const maxTotalScore = computed(() => results.value.reduce((sum, r) => sum + (r.subtest?.maxScore ?? 0), 0))
const tryOutId = computed(() => attempt.value?.tryOut?.id ?? 0)

const { data: lbData, isLoading: lbLoading, isError: lbError, refetch: lbRefetch } = useQuery({
  queryKey: computed(() => ['leaderboard', tryOutId.value]),
  queryFn: () => TryoutAttemptService.getLeaderboard(tryOutId.value),
  enabled: computed(() => !!tryOutId.value),
  staleTime: 1000 * 60,
})

const leaderboardEntries = computed(() => lbData.value?.data ?? [])

function scoreColor(score?: number) {
  if (!score) return 'text-gray-400'
  if (score >= 80) return 'text-emerald-600'
  if (score >= 60) return 'text-amber-600'
  return 'text-red-500'
}

// For per-subtest: use percentage of maxScore for color thresholds
function subtestScoreColor(score?: number, maxScore?: number) {
  if (!score || !maxScore) return 'text-gray-400'
  const pct = (score / maxScore) * 100
  if (pct >= 70) return 'text-emerald-600'
  if (pct >= 50) return 'text-amber-600'
  return 'text-red-500'
}

function subtestScoreBg(score?: number, maxScore?: number) {
  if (!score || !maxScore) return 'bg-gray-50'
  const pct = (score / maxScore) * 100
  if (pct >= 70) return 'bg-emerald-50'
  if (pct >= 50) return 'bg-amber-50'
  return 'bg-red-50'
}

function formatDate(d?: string) {
  if (!d) return '-'
  return new Date(d).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-2xl mx-auto space-y-5">

      <!-- Loading -->
      <div v-if="isLoading" class="space-y-4 animate-pulse">
        <div class="h-40 bg-white rounded-2xl border border-gray-100" />
        <div class="h-64 bg-white rounded-2xl border border-gray-100" />
      </div>

      <!-- Error -->
      <div v-else-if="isError" class="bg-white rounded-2xl border border-gray-100 p-8 text-center space-y-3">
        <Icon icon="mdi:alert-circle-outline" class="text-5xl text-red-400 mx-auto" />
        <p class="text-gray-600">Gagal memuat hasil. Mungkin ujian belum selesai.</p>
        <button @click="router.replace(`/tryouts/exam/${regId}`)" class="text-primary text-sm hover:underline">
          Kembali ke Ujian
        </button>
      </div>

      <template v-else-if="attempt">
        <!-- Score hero -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
          <div class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Icon icon="mdi:trophy-outline" class="text-4xl text-primary" />
          </div>
          <h1 class="text-xl font-extrabold text-gray-900 mb-1">{{ attempt.tryOut?.name ?? 'Try Out' }}</h1>
          <p class="text-sm text-gray-500 mb-4">Ujian selesai pada {{ formatDate(attempt.finishedAt) }}</p>
          <div class="inline-flex items-baseline gap-1">
            <span :class="['text-5xl font-extrabold', scoreColor(totalScore)]">
              {{ totalScore.toFixed(1) }}
            </span>
            <span class="text-gray-400 text-lg">/ {{ maxTotalScore.toFixed(0) }}</span>
          </div>
          <p class="text-xs text-gray-400 mt-1">Total skor semua subtes</p>
        </div>

        <!-- Per-subtest breakdown -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 class="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
            <Icon icon="mdi:chart-bar" class="text-primary" /> Rincian Per Subtes
          </h2>
          <div class="space-y-3">
            <div v-for="r in results" :key="r.id"
              :class="['rounded-xl p-4 border', subtestScoreBg(r.finalScore ?? 0, r.subtest?.maxScore)]">
              <div class="flex items-center justify-between mb-2">
                <div>
                  <p class="font-bold text-gray-900 text-sm">{{ r.subtest?.name ?? `Subtes #${r.subtestId}` }}</p>
                  <p class="text-xs text-gray-400">{{ r.subtest?.code }}</p>
                </div>
                <div class="text-right">
                  <span :class="['text-xl font-extrabold', subtestScoreColor(r.finalScore ?? 0, r.subtest?.maxScore)]">
                    {{ r.finalScore?.toFixed(1) ?? '-' }}
                  </span>
                  <p class="text-[10px] text-gray-400">/ {{ r.subtest?.maxScore?.toFixed(0) ?? '?' }}</p>
                </div>
              </div>
              <div class="flex gap-3 text-xs">
                <span class="flex items-center gap-1 text-emerald-600">
                  <Icon icon="mdi:check-circle" /> {{ r.correctCount }} benar
                </span>
                <span class="flex items-center gap-1 text-red-500">
                  <Icon icon="mdi:close-circle" /> {{ r.wrongCount }} salah
                </span>
                <span class="flex items-center gap-1 text-gray-400">
                  <Icon icon="mdi:minus-circle" /> {{ r.unansweredCount }} kosong
                </span>
              </div>
              <!-- Score bar -->
              <div class="mt-2 h-1.5 bg-white/60 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all"
                  :class="subtestScoreColor(r.finalScore ?? 0, r.subtest?.maxScore).replace('text-', 'bg-')"
                  :style="{ width: `${Math.min(100, ((r.finalScore ?? 0) / (r.subtest?.maxScore ?? 100)) * 100)}%` }" />
              </div>
              <RouterLink
                :to="`/tryouts/exam/${regId}/result/${attemptId}/review/${r.subtestId}`"
                class="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
                <Icon icon="mdi:book-open-outline" /> Lihat Pembahasan
              </RouterLink>
            </div>
          </div>
        </div>

        <!-- Leaderboard -->
        <LeaderboardPanel
          v-if="tryOutId"
          :entries="leaderboardEntries"
          :is-loading="lbLoading"
          :is-error="lbError"
          :current-user-id="currentUserId"
          @retry="lbRefetch()"
        />

        <!-- Actions -->
        <div class="flex gap-3">
          <RouterLink to="/tryouts"
            class="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors text-center">
            Jelajahi Try Out
          </RouterLink>
          <RouterLink to="/dashboard/user"
            class="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors text-center">
            Ke Dashboard
          </RouterLink>
        </div>
      </template>
    </div>
  </div>
</template>
