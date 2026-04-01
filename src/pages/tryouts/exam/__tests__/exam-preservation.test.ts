/**
 * Preservation Property Tests
 *
 * Property 2: Normal Subtest Load Behavior Unchanged
 *
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7
 *
 * These tests MUST PASS on UNFIXED code — they document baseline behavior to preserve.
 * They cover the non-bug path: cases where isBugCondition is false.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useExamStore } from '../../../../stores/exam'
import { startTimer } from '../../../../utils/examTimer'
import type { SubtestProgress, QuestionForExam } from '../../../../services/tryout.attempt'

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})

/** Build a minimal SubtestProgress entry */
function makeProgress(subtestId: number, status: SubtestProgress['status'], timeLimitSeconds: number): SubtestProgress {
  return {
    subtestId,
    subtestCode: `TPS-${subtestId}`,
    subtestName: `Subtest ${subtestId}`,
    status,
    answeredCount: 0,
    totalCount: 20,
    timeLimitSeconds,
  }
}

/** Build a minimal question */
function makeQuestion(id: number): QuestionForExam {
  return {
    id,
    orderNumber: id,
    questionText: `Question ${id}`,
    difficultyLevel: 'medium',
    optionA: 'A', optionB: 'B', optionC: 'C', optionD: 'D', optionE: 'E',
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Test 1: Normal loadSubtest — matching currentSubtest.id (non-bug path)
// ─────────────────────────────────────────────────────────────────────────────
describe('Test 1: Normal loadSubtest with matching currentSubtest.id', () => {
  const matchingCases = [
    { subtestId: 1, timeLimitSeconds: 1800 },
    { subtestId: 2, timeLimitSeconds: 2400 },
  ]

  for (const tc of matchingCases) {
    it(`subtestId=${tc.subtestId} with matching currentSubtest.id → totalSeconds=${tc.timeLimitSeconds}`, () => {
      const exam = useExamStore()
      exam.init(42, 1, 'Test Tryout')

      const progress: SubtestProgress[] = [
        makeProgress(1, 'not_started', 1800),
        makeProgress(2, 'not_started', 2400),
      ]
      exam.setSubtestProgress(progress)

      // Non-bug path: state.currentSubtest.id === subtestId → guard is TRUE
      // timeLimitSeconds comes from state.currentSubtest.timeLimitSeconds
      const stateCurrentSubtest = { id: tc.subtestId, timeLimitSeconds: tc.timeLimitSeconds }
      const timeLimitSeconds =
        stateCurrentSubtest.id === tc.subtestId
          ? stateCurrentSubtest.timeLimitSeconds
          : 0

      const idx = exam.subtestProgress.findIndex(s => s.subtestId === tc.subtestId)
      exam.loadSubtest(tc.subtestId, idx, [], timeLimitSeconds)

      expect(exam.totalSeconds).toBe(tc.timeLimitSeconds)
      expect(exam.timeRemaining).toBeGreaterThan(0)
    })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// Test 2: Timer resume from localStorage
// ─────────────────────────────────────────────────────────────────────────────
describe('Test 2: Timer resume from localStorage', () => {
  it('resumes timer correctly when localStorage entry exists', () => {
    const exam = useExamStore()
    exam.init(42, 1, 'Test Tryout')

    const subtestId = 1
    const timeLimitSeconds = 1800

    // Pre-seed a timer in localStorage (simulates a previous session)
    startTimer(42, subtestId, timeLimitSeconds)

    const progress: SubtestProgress[] = [makeProgress(subtestId, 'in_progress', timeLimitSeconds)]
    exam.setSubtestProgress(progress)

    exam.loadSubtest(subtestId, 0, [], timeLimitSeconds)

    expect(exam.totalSeconds).toBe(timeLimitSeconds)
    expect(exam.timeRemaining).toBeGreaterThan(0)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Test 3: subtestProgress correctly updated after doSubmitSubtest flow
// ─────────────────────────────────────────────────────────────────────────────
describe('Test 3: subtestProgress correctly updated after submit flow', () => {
  it('updates progress when first subtest is completed', () => {
    const exam = useExamStore()
    exam.init(42, 1, 'Test Tryout')

    const initialProgress: SubtestProgress[] = [
      makeProgress(1, 'not_started', 1800),
      makeProgress(2, 'not_started', 2400),
    ]
    exam.setSubtestProgress(initialProgress)

    // Simulate what getCurrentState() returns after submit: first subtest completed
    const updatedProgress: SubtestProgress[] = [
      { ...makeProgress(1, 'completed', 1800), answeredCount: 20 },
      makeProgress(2, 'not_started', 2400),
    ]
    exam.setSubtestProgress(updatedProgress)

    expect(exam.subtestProgress[0].status).toBe('completed')
    expect(exam.subtestProgress[1].status).toBe('not_started')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Test 4: answers cleared between subtests (no bleed-over)
// ─────────────────────────────────────────────────────────────────────────────
describe('Test 4: answers cleared between subtests', () => {
  it('does not carry over answers from subtest 1 when loading subtest 2', () => {
    const exam = useExamStore()
    exam.init(42, 1, 'Test Tryout')

    const progress: SubtestProgress[] = [
      makeProgress(1, 'not_started', 1800),
      makeProgress(2, 'not_started', 2400),
    ]
    exam.setSubtestProgress(progress)

    // Load subtest 1 with questions 101, 102, 103
    const qs1 = [makeQuestion(101), makeQuestion(102), makeQuestion(103)]
    exam.loadSubtest(1, 0, qs1, 1800)

    // Answer some questions in subtest 1
    exam.setAnswer(101, 'A')
    exam.setAnswer(102, 'B')

    // Load subtest 2 with different questions 201, 202
    const qs2 = [makeQuestion(201), makeQuestion(202)]
    exam.loadSubtest(2, 1, qs2, 2400)

    // Subtest 1 question IDs must not appear in answers
    expect(exam.answers[101]).toBeUndefined()
    expect(exam.answers[102]).toBeUndefined()
    expect(exam.answers[103]).toBeUndefined()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Test 5: timer set to 0 when timeLimitSeconds=0 (current behavior on bug path)
// ─────────────────────────────────────────────────────────────────────────────
describe('Test 5: timer set to 0 when timeLimitSeconds=0 (bug path baseline)', () => {
  it('documents current behavior: totalSeconds=0 when loadSubtest called with timeLimitSeconds=0', () => {
    const exam = useExamStore()
    exam.init(42, 1, 'Test Tryout')

    const progress: SubtestProgress[] = [makeProgress(2, 'not_started', 1800)]
    exam.setSubtestProgress(progress)

    // Bug path: guard fails → timeLimitSeconds=0 passed to store
    exam.loadSubtest(2, 0, [], 0)

    // This is the observable bug behavior — totalSeconds is 0
    expect(exam.totalSeconds).toBe(0)
  })
})
