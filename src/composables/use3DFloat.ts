import { ref } from 'vue'

/**
 * Composable for 3D floating animation parameters.
 * Usage inside useLoop/onBeforeRender:
 *   mesh.position.y = baseY + Math.sin(t) * amplitude
 *   mesh.rotation.y += rotationSpeed
 */
export function use3DFloat(baseY: number = 0) {
  const t = ref(0)
  const amplitude = 0.4   // ±0.4 world units (~6px equivalent)
  const speed = 0.008     // smooth sine period ~3-4s
  const rotationSpeed = 0.004 // very slow Y rotation

  const update = () => {
    t.value += speed
  }

  const getY = (): number => {
    return baseY + Math.sin(t.value) * amplitude
  }

  return { t, update, getY, rotationSpeed, amplitude, speed }
}
