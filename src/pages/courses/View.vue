<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { Icon } from '@iconify/vue'
import { Image } from '@unpic/vue'
import { toast } from 'vue3-toastify'
import { CourseService } from '../../services/course'
import { CourseQuestionService } from '../../services/course.questions'
import { CourseRegistrationService } from '../../services/course.registration'
import { useAuth } from '../../stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuth()
const qc = useQueryClient()
const id = Number(route.params.id)

// Fetch course detail
const { data: courseData, isLoading, isError } = useQuery({
  queryKey: ['course', id],
  queryFn: () => CourseService.findOne(id),
})

// Fetch registration questions
const { data: questionsData } = useQuery({
  queryKey: ['course-questions', id],
  queryFn: () => CourseQuestionService.getByCourse(id),
  enabled: !!id,
})

// Fetch my registrations to check if already registered
const { data: myRegsData, refetch: refetchMyRegs } = useQuery({
  queryKey: ['my-course-registrations'],
  queryFn: () => CourseRegistrationService.getMyRegistrations(),
  enabled: !!auth.user,
})

const course = computed(() => courseData.value?.data ?? null)
const questions = computed(() => (questionsData.value?.data ?? []).sort((a, b) => a.questionOrder - b.questionOrder))
const hasQuestions = computed(() => questions.value.length > 0)
const myRegistration = computed(() => myRegsData.value?.data?.find(r => r.courseId === id) ?? null)

// Registration form state
const showForm = ref(false)
// answers keyed by questionId
const answers = ref<Record<number, string>>({})

function openForm() {
  if (!auth.user) { router.push('/auth/login'); return }
  if (hasQuestions.value) {
    // init answers
    answers.value = {}
    questions.value.forEach(q => { answers.value[q.id] = '' })
    showForm.value = true
  } else {
    doRegister()
  }
}

const allAnswered = computed(() =>
  questions.value.every(q => (answers.value[q.id] ?? '').trim() !== '')
)

// Register mutation
const { mutate: doRegister, isPending: registering } = useMutation({
  mutationFn: () => CourseRegistrationService.register(id),
  onSuccess: () => {
    toast.success('Pendaftaran berhasil! Menunggu persetujuan admin.')
    refetchMyRegs()
    qc.invalidateQueries({ queryKey: ['my-course-registrations'] })
  },
  onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Gagal mendaftar'),
})

const submitting = ref(false)
async function submitWithAnswers() {
  if (!allAnswered.value) { toast.error('Jawab semua pertanyaan terlebih dahulu'); return }
  submitting.value = true
  try {
    const answerList = questions.value.map(q => ({ questionId: q.id, answerText: answers.value[q.id] ?? '' }))
    await CourseRegistrationService.register(id, answerList)
    toast.success('Pendaftaran berhasil! Menunggu persetujuan admin.')
    showForm.value = false
    refetchMyRegs()
    qc.invalidateQueries({ queryKey: ['my-course-registrations'] })
  } catch (err: any) {
    toast.error(err?.response?.data?.message ?? 'Gagal mendaftar')
  } finally {
    submitting.value = false
  }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

const statusCfg: Record<string, { label: string; color: string; icon: string }> = {
  pending:  { label: 'Menunggu Persetujuan', color: 'text-amber-700 bg-amber-50 border-amber-200', icon: 'mdi:clock-outline' },
  approved: { label: 'Terdaftar', color: 'text-green-700 bg-green-50 border-green-200', icon: 'mdi:check-circle' },
  rejected: { label: 'Ditolak', color: 'text-red-700 bg-red-50 border-red-200', icon: 'mdi:close-circle' },
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 pt-20">
    <!-- Loading -->
    <div v-if="isLoading" class="max-w-4xl mx-auto px-4 py-10 space-y-4 animate-pulse">
      <div class="h-64 bg-gray-200 rounded-2xl" />
      <div class="h-5 bg-gray-200 rounded w-1/2" />
      <div class="h-4 bg-gray-200 rounded w-1/3" />
    </div>

    <!-- Error -->
    <div v-else-if="isError" class="max-w-4xl mx-auto px-4 py-20 text-center text-red-500 space-y-3">
      <Icon icon="mdi:alert-circle-outline" class="text-6xl mx-auto" />
      <p class="text-xl font-semibold">Gagal memuat kelas.</p>
      <button @click="router.go(0)" class="text-sm text-primary hover:underline">Coba lagi</button>
    </div>

    <template v-else-if="course">
      <!-- Hero -->
      <div class="relative w-full h-60 md:h-72 max-w-[90%] mx-auto shadow-md bg-gray-200 overflow-hidden rounded-b-2xl">
        <Image v-if="course.image" :src="course.image" :alt="course.nameCourse" class="w-full h-full object-cover" />
        <div v-else class="w-full h-full flex items-center justify-center text-gray-200">
          <Icon icon="mdi:book-education-outline" class="text-8xl" />
        </div>
        <div class="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
        <button @click="router.back()" class="absolute top-4 left-4 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors">
          <Icon icon="mdi:arrow-left" class="text-xl" />
        </button>
        <div class="absolute bottom-5 left-6 right-6">
          <p v-if="course.program" class="text-xs text-green-300 font-semibold mb-1">{{ course.program.programName }}</p>
          <div class="flex items-center gap-2 mb-1">
            <span :class="['px-2.5 py-0.5 rounded-full text-xs font-bold', course.isFree ? 'bg-green-400 text-white' : 'bg-amber-400 text-white']">
              {{ course.isFree ? 'GRATIS' : 'BERBAYAR' }}
            </span>
          </div>
          <h1 class="text-2xl md:text-3xl font-extrabold text-white drop-shadow-lg">{{ course.nameCourse }}</h1>
        </div>
      </div>

      <div class="max-w-4xl mx-auto px-4 py-8 space-y-5">
        <!-- Info bar -->
        <div class="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-wrap gap-6">
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <Icon icon="mdi:calendar-start" class="text-primary text-lg" />
            <div>
              <p class="text-xs text-gray-400">Mulai</p>
              <p class="font-semibold">{{ formatDate(course.startDate) }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <Icon icon="mdi:calendar-end" class="text-red-400 text-lg" />
            <div>
              <p class="text-xs text-gray-400">Selesai</p>
              <p class="font-semibold">{{ formatDate(course.endDate) }}</p>
            </div>
          </div>
          <div v-if="course.creator" class="flex items-center gap-2 text-sm text-gray-600">
            <Icon icon="mdi:account-circle" class="text-gray-400 text-lg" />
            <div>
              <p class="text-xs text-gray-400">Penanggung jawab</p>
              <p class="font-semibold">{{ course.creator.username }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <Icon icon="mdi:book-open-page-variant-outline" class="text-gray-400 text-lg" />
            <div>
              <p class="text-xs text-gray-400">Kelas</p>
              <p class="font-semibold">{{ course.classes?.length ?? 0 }} kelas</p>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div v-if="course.description" class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 class="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Icon icon="mdi:text-box-outline" class="text-primary" />
            Tentang Kelas
          </h2>
          <div class="prose prose-sm max-w-none text-gray-700 leading-relaxed" v-html="course.description" />
        </div>

        <!-- Classes list -->
        <div v-if="course.classes && course.classes.length > 0" class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 class="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Icon icon="mdi:format-list-bulleted" class="text-primary" />
            Materi Kelas
            <span class="ml-auto text-sm font-normal text-gray-400">{{ course.classes.length }} kelas</span>
          </h2>
          <div class="divide-y divide-gray-50">
            <div v-for="cls in course.classes" :key="cls.id" class="py-3 flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon icon="mdi:book-open-outline" class="text-primary text-sm" />
              </div>
              <div>
                <p class="font-semibold text-gray-800 text-sm">{{ cls.name }}</p>
                <p v-if="cls.description" v-html="cls.description" class="text-xs text-gray-400 line-clamp-1"></p>
              </div>
            </div>
          </div>
        </div>

        <!-- Registration Section -->
        <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 class="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Icon icon="mdi:clipboard-check-outline" class="text-primary" />
            Pendaftaran
          </h2>

          <!-- Already registered -->
          <template v-if="myRegistration">
            <div :class="['border rounded-xl p-4 mb-4 text-sm font-medium flex items-center gap-2', statusCfg[myRegistration.status]?.color]">
              <Icon :icon="statusCfg[myRegistration.status]?.icon ?? 'mdi:information'" class="text-lg shrink-0" />
              <div>
                <p class="font-semibold">{{ statusCfg[myRegistration.status]?.label }}</p>
              </div>
            </div>

            <!-- WhatsApp link if approved -->
            <a
              v-if="myRegistration.status === 'approved' && myRegistration.whatsappGroupLink"
              :href="myRegistration.whatsappGroupLink"
              target="_blank"
              class="flex items-center gap-2 w-full py-3 rounded-xl bg-green-500 text-white font-semibold text-sm justify-center hover:bg-green-600 transition-colors mb-3"
            >
              <Icon icon="mdi:whatsapp" class="text-lg" />
              Bergabung ke Grup WhatsApp
            </a>

            <!-- Start learning button for approved -->
            <RouterLink
              v-if="myRegistration.status === 'approved'"
              :to="`/courses/${id}/learn`"
              class="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors mb-2"
            >
              <Icon icon="mdi:play-circle-outline" class="text-lg" />
              Mulai Belajar
            </RouterLink>

            <button v-else disabled class="w-full py-3 rounded-xl bg-gray-100 text-gray-400 font-semibold cursor-not-allowed text-sm">
              Sudah Terdaftar
            </button>
          </template>

          <!-- Not registered yet -->
          <template v-else>
            <!-- Registration form with questions -->
            <div v-if="showForm" class="space-y-5">
              <p class="text-sm text-gray-500">Jawab pertanyaan berikut untuk mendaftar:</p>

              <div v-for="q in questions" :key="q.id" class="space-y-1.5">
                <label class="text-sm font-medium text-gray-700">
                  {{ q.questionOrder }}. {{ q.questionText }}
                  <span class="text-red-400">*</span>
                </label>
                <textarea
                  v-if="q.questionType === 'text'"
                  v-model="answers[q.id]"
                  rows="3"
                  :placeholder="`Jawaban kamu...`"
                  class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
                <input
                  v-else
                  v-model="answers[q.id]"
                  type="text"
                  :placeholder="`Jawaban kamu...`"
                  class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div class="flex gap-2 pt-1">
                <button
                  @click="submitWithAnswers"
                  :disabled="!allAnswered || submitting"
                  class="flex-1 py-3 rounded-xl bg-primary text-white font-semibold text-sm disabled:opacity-50 hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Icon v-if="submitting" icon="mdi:loading" class="animate-spin" />
                  {{ submitting ? 'Mendaftar...' : 'Kirim & Daftar' }}
                </button>
                <button
                  @click="showForm = false"
                  class="px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-600 hover:border-gray-300 transition-colors"
                >
                  Batal
                </button>
              </div>
            </div>

            <!-- Direct register button -->
            <template v-else>
              <p class="text-sm text-gray-500 mb-4">
                {{ hasQuestions ? 'Kamu perlu mengisi formulir pendaftaran terlebih dahulu.' : 'Daftar sekarang untuk mendapatkan akses ke kelas ini.' }}
              </p>
              <button
                @click="openForm"
                :disabled="registering"
                class="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                <Icon v-if="registering" icon="mdi:loading" class="animate-spin" />
                {{ registering ? 'Mendaftar...' : hasQuestions ? 'Isi Formulir & Daftar' : 'Daftar Sekarang' }}
              </button>
            </template>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>
