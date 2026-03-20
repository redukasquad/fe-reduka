<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { toast } from 'vue3-toastify'
import { TryoutAttemptService } from '../../../services/tryout.attempt'
import { useExamStore } from '../../../stores/exam'
import TimerBar from '../../../components/exam/TimerBar.vue'
import SubtestHeader from '../../../components/exam/SubtestHeader.vue'
import QuestionCard from '../../../components/exam/QuestionCard.vue'
import QuestionNavigation from '../../../components/exam/QuestionNavigation.vue'

const route = useRoute()
const router = useRouter()
const exam = useExamStore()

const regId = Number(route.params.registrationId)
const attemptId = Number(route.params.attemptId)

const loading = ref(true)
const submitting = ref(false)
const showNav = ref(false)
const showSubmitConfirm = ref(false)

const currentSubtestInfo = computed(() =>
  exam.subtestProgress.find(s => s.subtestId === exam.currentSubtestId)
)
const questionIds = computed(() => exam.questions.map(q => q.id))

// ── Init ──────────────────────────────────────────────────────────────────────
onMounted(async () => {
  window.addEventListener('beforeunload', onBeforeUnload)
  try {
    const stateRes = await TryoutAttemptService.getCurrentState(attemptId)
    const state = stateRes.data
    if (!state) throw new Error('Gagal memuat state')

    if (state.status === 'completed') {
      router.replace(`/tryouts/exam/${regId}/result/${attemptId}`)
      return
    }

    exam.init(attemptId, regId, '')
    exam.setSubtestProgress(state.subtestProgress ?? [])

    const nextSubtest = state.subtestProgress?.find(s => s.status !== 'completed')
    if (!nextSubtest) {
      await finishAttempt()
      return
    }

    await loadSubtest(nextSubtest.subtestId)
  } catch (e: any) {
    toast.error(e?.response?.data?.message ?? 'Gagal memuat ujian')
    router.replace(`/tryouts/exam/${regId}`)
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  exam.stopTimer()
  window.removeEventListener('beforeunload', onBeforeUnload)
})

function onBeforeUnload(e: BeforeUnloadEvent) {
  e.preventDefault()
}

// ── Load subtest ──────────────────────────────────────────────────────────────
async function loadSubtest(subtestId: number) {
  // Mark subtest as in_progress on backend + get questions
  const qRes = await TryoutAttemptService.startSubtest(attemptId, subtestId)
  const questions = qRes.data ?? []

  // Fetch fresh state to get currentSubtest.timeLimitSeconds and updated progress
  const stateRes = await TryoutAttemptService.getCurrentState(attemptId)
  const state = stateRes.data

  if (state?.subtestProgress) exam.setSubtestProgress(state.subtestProgress)

  // timeLimitSeconds from backend is the source of truth
  const timeLimitSeconds = state?.currentSubtest?.timeLimitSeconds ?? 0

  const idx = exam.subtestProgress.findIndex(s => s.subtestId === subtestId)
  exam.loadSubtest(subtestId, idx, questions, timeLimitSeconds)
}

// Auto-submit when timer hits 0
watch(() => exam.timeRemaining, (val) => {
  if (val === 0 && exam.currentSubtestId && !submitting.value) {
    toast.info('Waktu habis! Subtes otomatis disubmit.')
    doSubmitSubtest()
  }
})

// ── Answer ────────────────────────────────────────────────────────────────────
function selectAnswer(option: string) {
  if (!exam.currentQuestion) return
  exam.setAnswer(exam.currentQuestion.id, option)
}

function goNext() {
  if (exam.currentQuestionIndex < exam.totalQuestions - 1)
    exam.goToQuestion(exam.currentQuestionIndex + 1)
}

function goPrev() {
  if (exam.currentQuestionIndex > 0)
    exam.goToQuestion(exam.currentQuestionIndex - 1)
}

// ── Submit subtest ────────────────────────────────────────────────────────────
async function doSubmitSubtest() {
  if (submitting.value || !exam.currentSubtestId) return
  submitting.value = true
  exam.stopTimer()

  try {
    const answers = exam.questions.map(q => ({
      questionId: q.id,
      selectedOption: exam.answers[q.id] ?? '',
    }))

    await TryoutAttemptService.submitSubtest(attemptId, exam.currentSubtestId, answers)

    // Clear localStorage timer for this subtest
    exam.clearSubtestTimer()

    // Refresh state
    const stateRes = await TryoutAttemptService.getCurrentState(attemptId)
    const state = stateRes.data
    exam.setSubtestProgress(state?.subtestProgress ?? [])

    const nextSubtest = state?.subtestProgress?.find(s => s.status === 'not_started')
    if (nextSubtest) {
      toast.success('Subtes selesai! Lanjut ke subtes berikutnya.')
      await loadSubtest(nextSubtest.subtestId)
    } else {
      await finishAttempt()
    }
  } catch (e: any) {
    toast.error(e?.response?.data?.message ?? 'Gagal submit subtes')
    // Restart timer if submit failed
    exam.stopTimer()
  } finally {
    submitting.value = false
    showSubmitConfirm.value = false
  }
}

async function finishAttempt() {
  try {
    await TryoutAttemptService.finishAttempt(attemptId)
    toast.success('Ujian selesai! Melihat hasil...')
  } catch {
    // already completed is fine
  }
  router.replace(`/tryouts/exam/${regId}/result/${attemptId}`)
}
</script>

<template>
  <!-- Loading -->
  <div v-if="loading" class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-center space-y-3">
      <Icon icon="mdi:loading" class="text-4xl text-primary animate-spin mx-auto" />
      <p class="text-sm text-gray-500">Memuat soal...</p>
    </div>
  </div>

  <!-- Exam UI -->
  <div v-else class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Top bar -->
    <div class="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-20 shadow-sm">
      <div class="max-w-2xl mx-auto space-y-2">
        <SubtestHeader :subtests="exam.subtestProgress" :current-subtest-id="exam.currentSubtestId ?? 0" />
        <TimerBar :seconds="exam.timeRemaining" :total-seconds="exam.totalSeconds" />
      </div>
    </div>

    <!-- Main content -->
    <div class="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
      <div class="flex items-center justify-between mb-5">
        <div>
          <p class="text-xs text-gray-400 font-medium">
            Subtes {{ exam.currentSubtestIndex + 1 }} dari {{ exam.subtestProgress.length }}
          </p>
          <h2 class="font-extrabold text-gray-900">{{ currentSubtestInfo?.subtestName ?? '...' }}</h2>
        </div>
        <button @click="showNav = !showNav"
          class="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
          <Icon icon="mdi:view-grid-outline" />
          {{ exam.answeredCount }}/{{ exam.totalQuestions }}
        </button>
      </div>

      <!-- Question card -->
      <div v-if="exam.currentQuestion" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
        <QuestionCard
          :question="exam.currentQuestion"
          :index="exam.currentQuestionIndex"
          :total="exam.totalQuestions"
          :selected-option="exam.answers[exam.currentQuestion.id]"
          @select="selectAnswer"
        />
      </div>

      <!-- Navigation buttons -->
      <div class="flex items-center gap-3">
        <button @click="goPrev" :disabled="exam.currentQuestionIndex === 0"
          class="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors">
          <Icon icon="mdi:chevron-left" /> Sebelumnya
        </button>
        <div class="flex-1" />
        <button v-if="exam.currentQuestionIndex < exam.totalQuestions - 1"
          @click="goNext"
          class="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">
          Berikutnya <Icon icon="mdi:chevron-right" />
        </button>
        <button v-else
          @click="showSubmitConfirm = true"
          :disabled="submitting"
          class="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 disabled:opacity-50 transition-colors shadow-sm">
          <Icon icon="mdi:check-circle-outline" /> Submit Subtes
        </button>
      </div>
    </div>

    <!-- Question nav drawer -->
    <Teleport to="body">
      <Transition name="slide-up">
        <div v-if="showNav" class="fixed inset-0 z-40 flex items-end justify-center">
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showNav = false" />
          <div class="relative w-full max-w-2xl bg-white rounded-t-2xl p-5 shadow-2xl">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-bold text-gray-900 text-sm">Navigasi Soal</h3>
              <button @click="showNav = false"
                class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100">
                <Icon icon="mdi:close" />
              </button>
            </div>
            <div class="mb-3 flex gap-3 text-xs">
              <span class="flex items-center gap-1.5">
                <span class="w-4 h-4 rounded bg-primary inline-block" /> Sedang dikerjakan
              </span>
              <span class="flex items-center gap-1.5">
                <span class="w-4 h-4 rounded bg-emerald-100 inline-block" /> Sudah dijawab
              </span>
              <span class="flex items-center gap-1.5">
                <span class="w-4 h-4 rounded bg-gray-100 inline-block" /> Belum dijawab
              </span>
            </div>
            <QuestionNavigation
              :total="exam.totalQuestions"
              :current="exam.currentQuestionIndex"
              :answers="exam.answers"
              :question-ids="questionIds"
              @go="(i) => { exam.goToQuestion(i); showNav = false }"
            />
            <button @click="showSubmitConfirm = true; showNav = false"
              class="mt-4 w-full py-3 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition-colors">
              Submit Subtes ({{ exam.answeredCount }}/{{ exam.totalQuestions }} dijawab)
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Submit confirm modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showSubmitConfirm" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showSubmitConfirm = false" />
          <div class="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 text-center">
            <div class="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <Icon icon="mdi:alert-outline" class="text-amber-500 text-2xl" />
            </div>
            <h3 class="font-bold text-gray-900 mb-1">Submit Subtes?</h3>
            <p class="text-sm text-gray-500 mb-1">
              Kamu sudah menjawab
              <span class="font-bold text-primary">{{ exam.answeredCount }}</span> dari
              <span class="font-bold">{{ exam.totalQuestions }}</span> soal.
            </p>
            <p v-if="exam.answeredCount < exam.totalQuestions" class="text-xs text-amber-600 mb-4">
              {{ exam.totalQuestions - exam.answeredCount }} soal belum dijawab.
            </p>
            <p v-else class="text-xs text-emerald-600 mb-4">Semua soal sudah dijawab.</p>
            <div class="flex gap-2">
              <button @click="showSubmitConfirm = false"
                class="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Batal
              </button>
              <button @click="doSubmitSubtest()" :disabled="submitting"
                class="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                <Icon v-if="submitting" icon="mdi:loading" class="animate-spin" />
                {{ submitting ? 'Menyimpan...' : 'Ya, Submit' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.25s ease; }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(100%); }
</style>
