/**
 * Persistent exam timer utility.
 * Source of truth: localStorage per attempt+subtest.
 * Key: tryout_timer_{attemptId}_{subtestId}
 * Value: { startedAt: ms timestamp, duration: ms }
 *
 * remainingMs = duration - (Date.now() - startedAt)
 */

interface TimerEntry {
  startedAt: number  // Date.now() when subtest started
  duration: number   // timeLimitSeconds * 1000
}

function key(attemptId: number, subtestId: number): string {
  return `tryout_timer_${attemptId}_${subtestId}`
}

/**
 * Start or update a timer for a subtest.
 * - If no entry exists: creates fresh with startedAt = now.
 * - If entry exists (resume): preserves startedAt, updates duration from backend.
 *   This ensures totalSeconds always reflects the correct DB value.
 */
export function startTimer(attemptId: number, subtestId: number, timeLimitSeconds: number): void {
  const existing = localStorage.getItem(key(attemptId, subtestId))
  let startedAt = Date.now()

  if (existing) {
    try {
      const parsed: TimerEntry = JSON.parse(existing)
      startedAt = parsed.startedAt // preserve original start time on resume
    } catch {
      // corrupt entry — start fresh
    }
  }

  const entry: TimerEntry = {
    startedAt,
    duration: timeLimitSeconds * 1000, // always use backend value
  }
  localStorage.setItem(key(attemptId, subtestId), JSON.stringify(entry))
}

/**
 * Get remaining seconds for a subtest.
 * Returns null if no entry exists (subtest not started yet).
 * Returns 0 if time has expired.
 */
export function getRemainingSeconds(attemptId: number, subtestId: number): number | null {
  const raw = localStorage.getItem(key(attemptId, subtestId))
  if (!raw) return null

  try {
    const entry: TimerEntry = JSON.parse(raw)
    const elapsed = Date.now() - entry.startedAt
    const remainingMs = entry.duration - elapsed
    return Math.max(0, Math.floor(remainingMs / 1000))
  } catch {
    return null
  }
}

/** Get the total duration in seconds for a subtest (for progress bar). */
export function getTotalSeconds(attemptId: number, subtestId: number): number {
  const raw = localStorage.getItem(key(attemptId, subtestId))
  if (!raw) return 0
  try {
    const entry: TimerEntry = JSON.parse(raw)
    return Math.floor(entry.duration / 1000)
  } catch {
    return 0
  }
}

/** Clear timer entry after subtest is submitted. */
export function clearTimer(attemptId: number, subtestId: number): void {
  localStorage.removeItem(key(attemptId, subtestId))
}

/** Check if a timer entry exists (subtest was started before). */
export function hasTimer(attemptId: number, subtestId: number): boolean {
  return localStorage.getItem(key(attemptId, subtestId)) !== null
}
