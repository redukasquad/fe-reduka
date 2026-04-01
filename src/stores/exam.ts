import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { QuestionForExam, SubtestProgress } from '../services/tryout.attempt'
import {
  startTimer as lsStartTimer,
  getRemainingSeconds,
  clearTimer,
  hasTimer,
} from '../utils/examTimer'

export const useExamStore = defineStore('exam', () => {
  const attemptId = ref<number | null>(null)
  const registrationId = ref<number | null>(null)
  const tryOutName = ref('')

  // Current subtest
  const currentSubtestId = ref<number | null>(null)
  const currentSubtestIndex = ref(0)
  const questions = ref<QuestionForExam[]>([])
  const currentQuestionIndex = ref(0)
  const subtestProgress = ref<SubtestProgress[]>([])

  // Answers: map questionId → selectedOption
  const answers = ref<Record<number, string>>({})

  // Timer — driven by localStorage wall-clock diff, ticked by interval
  const timeRemaining = ref(0)
  const totalSeconds = ref(0)  // full duration for progress bar
  let timerInterval: ReturnType<typeof setInterval> | null = null

  const currentQuestion = computed(() => questions.value[currentQuestionIndex.value] ?? null)
  const totalQuestions = computed(() => questions.value.length)
  const answeredCount = computed(() => Object.values(answers.value).filter(v => v !== '').length)

  function init(aId: number, regId: number, name: string) {
    attemptId.value = aId
    registrationId.value = regId
    tryOutName.value = name
  }

  /**
   * Load a subtest into the store.
   * timeLimitSeconds: from SubtestBrief (backend source of truth).
   * If localStorage already has a timer for this subtest (resume), use it.
   * Otherwise start a fresh timer.
   */
  function loadSubtest(
    subtestId: number,
    idx: number,
    qs: QuestionForExam[],
    timeLimitSeconds: number,
  ) {
    const aId = attemptId.value!

    currentSubtestId.value = subtestId
    currentSubtestIndex.value = idx
    questions.value = qs
    currentQuestionIndex.value = 0

    // Fully replace answers object — prevents bleed-over from previous subtest
    const freshAnswers: Record<number, string> = {}
    for (const q of qs) {
      if (q.selectedOption) freshAnswers[q.id] = q.selectedOption
    }
    answers.value = freshAnswers

    // Timer: backend timeLimitSeconds is ALWAYS the source of truth for totalSeconds.
    // localStorage is only used for startedAt (to calculate remaining on resume).
    totalSeconds.value = timeLimitSeconds

    if (hasTimer(aId, subtestId)) {
      // Resume: recalculate remaining from wall clock, but update duration in case it changed
      lsStartTimer(aId, subtestId, timeLimitSeconds) // update duration field
      const remaining = getRemainingSeconds(aId, subtestId) ?? 0
      timeRemaining.value = remaining
    } else {
      // Fresh start
      lsStartTimer(aId, subtestId, timeLimitSeconds)
      timeRemaining.value = timeLimitSeconds
    }

    _startInterval(aId, subtestId)
  }

  /** Internal: tick timer every second using wall-clock diff (no drift). */
  function _startInterval(aId: number, subtestId: number) {
    stopTimer()
    timerInterval = setInterval(() => {
      const remaining = getRemainingSeconds(aId, subtestId)
      if (remaining === null || remaining <= 0) {
        timeRemaining.value = 0
        stopTimer()
      } else {
        timeRemaining.value = remaining
      }
    }, 1000)
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
  }

  /** Call after subtest is submitted to clean up localStorage. */
  function clearSubtestTimer() {
    if (attemptId.value !== null && currentSubtestId.value !== null) {
      clearTimer(attemptId.value, currentSubtestId.value)
    }
  }

  function setAnswer(questionId: number, option: string) {
    answers.value[questionId] = option
  }

  function goToQuestion(idx: number) {
    if (idx >= 0 && idx < questions.value.length) {
      currentQuestionIndex.value = idx
    }
  }

  function setSubtestProgress(progress: SubtestProgress[]) {
    subtestProgress.value = progress
  }

  function markSubtestCompleted(subtestId: number) {
    const idx = subtestProgress.value.findIndex(s => s.subtestId === subtestId)

    if (idx !== -1) {
      const current = subtestProgress.value[idx]!

      subtestProgress.value[idx] = {
        ...current,
        status: 'completed'
      }
    }
  }

  function reset() {
    stopTimer()
    attemptId.value = null
    registrationId.value = null
    tryOutName.value = ''
    currentSubtestId.value = null
    currentSubtestIndex.value = 0
    questions.value = []
    currentQuestionIndex.value = 0
    answers.value = {}
    subtestProgress.value = []
    timeRemaining.value = 0
    totalSeconds.value = 0
  }

  return {
    attemptId, registrationId, tryOutName,
    currentSubtestId, currentSubtestIndex,
    questions, currentQuestionIndex, currentQuestion,
    totalQuestions, answeredCount,
    answers, timeRemaining, totalSeconds, subtestProgress,
    init, loadSubtest, setAnswer, goToQuestion,
    stopTimer, clearSubtestTimer, setSubtestProgress, markSubtestCompleted, reset,
  }
})
