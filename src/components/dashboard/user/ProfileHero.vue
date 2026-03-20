<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import * as THREE from 'three'
import gsap from 'gsap'
import type { User } from '../../../types/entites/user'

const props = defineProps<{
  user: User | null
  courseCount: number
  tryoutCount: number
  activeCount: number
}>()

const emit = defineEmits<{ editProfile: [] }>()

const canvasRef = ref<HTMLCanvasElement>()
const heroRef = ref<HTMLElement>()
const cardRef = ref<HTMLElement>()

let renderer: THREE.WebGLRenderer | null = null
let animId = 0

function initThree(canvas: HTMLCanvasElement) {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(55, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
  camera.position.z = 5
  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(canvas.clientWidth, canvas.clientHeight)

  const orbGroup = new THREE.Group()
  const colors = [0x6366f1, 0x8b5cf6, 0x06b6d4, 0x10b981]
  for (let i = 0; i < 6; i++) {
    const geo = new THREE.SphereGeometry(0.18 + Math.random() * 0.22, 16, 16)
    const mat = new THREE.MeshBasicMaterial({ color: colors[i % 4], transparent: true, opacity: 0.12 + Math.random() * 0.1 })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 3)
    orbGroup.add(mesh)
  }
  scene.add(orbGroup)

  const count = 180
  const pos = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 16
    pos[i * 3 + 1] = (Math.random() - 0.5) * 6
    pos[i * 3 + 2] = (Math.random() - 0.5) * 4
  }
  const pGeo = new THREE.BufferGeometry()
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.04, transparent: true, opacity: 0.5 })))

  let t = 0
  const tick = () => {
    animId = requestAnimationFrame(tick)
    t += 0.004
    orbGroup.rotation.y = t * 0.08
    orbGroup.rotation.x = Math.sin(t * 0.25) * 0.06
    orbGroup.children.forEach((c, i) => { c.position.y += Math.sin(t + i * 1.2) * 0.002 })
    renderer!.render(scene, camera)
  }
  tick()

  const onResize = () => {
    if (!canvas || !renderer) return
    camera.aspect = canvas.clientWidth / canvas.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
  }
  window.addEventListener('resize', onResize)
  return () => window.removeEventListener('resize', onResize)
}

let cleanupThree: (() => void) | undefined

onMounted(() => {
  if (canvasRef.value) cleanupThree = initThree(canvasRef.value) ?? undefined
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.fromTo(heroRef.value!, { opacity: 0 }, { opacity: 1, duration: 0.5 })
    .fromTo(cardRef.value!, { opacity: 0, y: 40, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.7 }, '-=0.2')
})

onUnmounted(() => {
  cancelAnimationFrame(animId)
  renderer?.dispose()
  cleanupThree?.()
})
</script>

<template>
  <div>
    <!-- Banner -->
    <div ref="heroRef" class="relative overflow-hidden bg-linear-to-b from-primary via-secondary to-white" style="min-height: 200px;">
      <canvas ref="canvasRef" class="absolute inset-0 w-full h-full pointer-events-none" />
      <div class="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-gray-50 to-transparent" />
      <div class="h-32" />
    </div>

    <!-- Profile card overlapping banner -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 -mt-16 relative z-10">
      <div ref="cardRef" class="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 sm:p-6">
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <!-- Avatar -->
          <div class="relative shrink-0">
            <div class="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-white shadow-lg">
              <img :src="user?.profileImage || '/profile.jpg'" :alt="user?.username" class="w-full h-full object-cover" />
            </div>
            <div v-if="user?.isVerified"
              class="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center ring-2 ring-white shadow-sm">
              <Icon icon="mdi:check-bold" class="text-white text-xs" />
            </div>
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <h1 class="text-xl font-extrabold text-gray-900 truncate">{{ user?.username }}</h1>
              <span v-if="user?.kelas" class="text-xs font-bold bg-primary/10 text-primary rounded-full px-2.5 py-0.5">{{ user.kelas }}</span>
              <span v-if="user?.role" class="text-xs font-bold bg-gray-100 text-gray-500 rounded-full px-2.5 py-0.5 uppercase tracking-wide">{{ user.role }}</span>
            </div>
            <p class="text-sm text-gray-500 mt-0.5">{{ user?.email }}</p>
            <div class="flex items-center gap-4 mt-2 flex-wrap">
              <span v-if="user?.noTelp" class="flex items-center gap-1 text-xs text-gray-500">
                <Icon icon="mdi:phone-outline" class="text-primary" />{{ user.noTelp }}
              </span>
              <span v-if="user?.jenisKelamin !== undefined" class="flex items-center gap-1 text-xs text-gray-500">
                <Icon :icon="user.jenisKelamin ? 'mdi:gender-male' : 'mdi:gender-female'" class="text-primary" />
                {{ user.jenisKelamin ? 'Laki-laki' : 'Perempuan' }}
              </span>
            </div>
          </div>

          <button @click="emit('editProfile')"
            class="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm">
            <Icon icon="mdi:pencil-outline" /> Edit Profil
          </button>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-gray-100">
          <div class="text-center">
            <p class="text-2xl font-extrabold text-gray-900">{{ courseCount }}</p>
            <p class="text-xs text-gray-500 mt-0.5">Course Terdaftar</p>
          </div>
          <div class="text-center border-x border-gray-100">
            <p class="text-2xl font-extrabold text-gray-900">{{ tryoutCount }}</p>
            <p class="text-xs text-gray-500 mt-0.5">Try Out Diikuti</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-extrabold text-primary">{{ activeCount }}</p>
            <p class="text-xs text-gray-500 mt-0.5">Course Aktif</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
