<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { Icon } from '@iconify/vue'
import { toast } from 'vue3-toastify'
import Editor from 'primevue/editor'
import { CourseSubjectService } from '../../../../services/course.subject'
import { CourseLessonService } from '../../../../services/course.lesson'
import { CreateSubjectSchema } from '../../../../schemas/course.subject'
import LessonList from './LessonList.vue'

const props = defineProps<{ courseId: number }>()
const queryClient = useQueryClient()

// Classes fetch — decoupled dari parent
const { data, isLoading } = useQuery({
  queryKey: ['course-classes', props.courseId],
  queryFn: () => CourseSubjectService.findAll(props.courseId),
  staleTime: 1000 * 60 * 2,
})

const classList = computed(() => data.value?.data ?? [])

// Expanded class
const expandedId = ref<number | null>(null)
const toggleExpand = (id: number) => {
  expandedId.value = expandedId.value === id ? null : id
}

// Add class form
const showAddClass = ref(false)
const { handleSubmit: handleClassSubmit, isSubmitting: classSubmitting, resetForm: resetClassForm } = useForm({
  validationSchema: toTypedSchema(CreateSubjectSchema),
})
const { value: className, errorMessage: classNameError } = useField<string>('name')
const { value: classDesc } = useField<string | undefined>('description')

const { mutate: createClass, isPending: creatingClass } = useMutation({
  mutationFn: (data: any) => CourseSubjectService.create(props.courseId, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['course-classes', props.courseId] })
    showAddClass.value = false
    resetClassForm()
    toast.success('Kelas berhasil ditambahkan')
  },
  onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Gagal menambahkan kelas'),
})

const onClassSubmit = handleClassSubmit(values => createClass(values))

const { mutate: deleteClass } = useMutation({
  mutationFn: (id: number) => CourseSubjectService.remove(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['course-classes', props.courseId] })
    toast.success('Kelas dihapus')
  },
  onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Gagal menghapus'),
})

// Add lesson
const showAddLesson = ref<number | null>(null) // classId
const lessonTitle = ref('')
const lessonOrder = ref(1)
const lessonStart = ref('')

const { mutate: createLesson, isPending: creatingLesson } = useMutation({
  mutationFn: ({ classId, data }: { classId: number; data: any }) =>
    CourseLessonService.create(classId, data),
  onSuccess: (_, vars) => {
    queryClient.invalidateQueries({ queryKey: ['course-lessons', vars.classId] })
    showAddLesson.value = null
    lessonTitle.value = ''
    lessonOrder.value = 1
    lessonStart.value = ''
    toast.success('Lesson berhasil ditambahkan')
  },
  onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Gagal menambahkan lesson'),
})

const submitLesson = (classId: number) => {
  if (!lessonTitle.value.trim()) return toast.error('Judul lesson wajib diisi')
  createLesson({
    classId,
    data: {
      title: lessonTitle.value,
      lessonOrder: lessonOrder.value,
      startTime: lessonStart.value || null,
    },
  })
}

const { mutate: deleteLesson } = useMutation({
  mutationFn: ({ id, classId: _cid }: { id: number; classId: number }) =>
    CourseLessonService.remove(id),
  onSuccess: (_, vars) => {
    queryClient.invalidateQueries({ queryKey: ['course-lessons', vars.classId] })
    toast.success('Lesson dihapus')
  },
  onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Gagal menghapus lesson'),
})
</script>

<template>
  <div class="space-y-3">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h3 class="font-semibold text-gray-800">
        Kelas
        <span class="ml-1.5 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
          {{ classList.length }}
        </span>
      </h3>
      <button
        @click="showAddClass = !showAddClass"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        <Icon :icon="showAddClass ? 'mdi:close' : 'mdi:plus'" />
        {{ showAddClass ? 'Batal' : 'Tambah Kelas' }}
      </button>
    </div>

    <!-- Add class inline form -->
    <div v-if="showAddClass" class="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-3">
      <p class="text-sm font-semibold text-primary">Kelas Baru</p>
      <div>
        <input
          v-model="className"
          type="text"
          placeholder="Nama kelas..."
          class="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
        />
        <p v-if="classNameError" class="text-red-500 text-xs mt-1">{{ classNameError }}</p>
      </div>
      <div class="rounded-xl border overflow-hidden">
        <Editor v-model="classDesc" editorStyle="height:150px" placeholder="Deskripsi (opsional)..." />
      </div>
      <div class="flex justify-end gap-2">
        <button @click="showAddClass = false; resetClassForm()" class="px-3 py-1.5 rounded-lg border text-sm text-gray-600 hover:bg-gray-50">Batal</button>
        <button
          @click="onClassSubmit"
          :disabled="creatingClass || classSubmitting"
          class="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
        >
          {{ creatingClass ? 'Menyimpan...' : 'Simpan' }}
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="space-y-2">
      <div v-for="n in 3" :key="n" class="h-14 bg-gray-100 rounded-lg animate-pulse" />
    </div>

    <!-- Empty -->
    <div v-else-if="classList.length === 0" class="py-10 text-center text-gray-400 border border-dashed rounded-xl">
      <Icon icon="mdi:book-off-outline" class="text-4xl mb-2" />
      <p class="text-sm">Belum ada kelas. Tambahkan kelas pertama.</p>
    </div>

    <!-- Class list -->
    <div v-else class="space-y-2">
      <div
        v-for="cls in classList"
        :key="cls.id"
        class="border rounded-xl bg-white overflow-hidden"
      >
        <!-- Class header row -->
        <div class="flex items-center gap-3 p-4">
          <button @click="toggleExpand(cls.id)" class="flex items-center gap-3 flex-1 min-w-0 text-left">
            <div class="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Icon icon="mdi:book-open-page-variant" class="text-primary text-sm" />
            </div>
            <div class="min-w-0">
              <p class="font-medium text-sm text-gray-800 truncate">{{ cls.name }}</p>
              <p class="text-xs text-gray-400">{{ cls.lessonCount ?? 0 }} lessons</p>
            </div>
            <Icon
              :icon="expandedId === cls.id ? 'mdi:chevron-up' : 'mdi:chevron-down'"
              class="text-gray-400 ml-auto shrink-0"
            />
          </button>
          <button
            @click="deleteClass(cls.id)"
            class="p-1.5 rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
            title="Hapus kelas"
          >
            <Icon icon="mdi:delete-outline" />
          </button>
        </div>

        <!-- Expanded: lessons -->
        <div v-if="expandedId === cls.id" class="border-t px-4 pb-4 pt-3 space-y-3 bg-gray-50/50">
          <LessonList :class-id="cls.id" @delete="(id: number) => deleteLesson({ id, classId: cls.id })" />

          <!-- Add lesson toggle -->
          <button
            @click="showAddLesson = showAddLesson === cls.id ? null : cls.id"
            class="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <Icon :icon="showAddLesson === cls.id ? 'mdi:close' : 'mdi:plus-circle-outline'" />
            {{ showAddLesson === cls.id ? 'Batal' : 'Tambah Lesson' }}
          </button>

          <!-- Add lesson form -->
          <div v-if="showAddLesson === cls.id" class="bg-white border rounded-lg p-3 space-y-2">
            <input
              v-model="lessonTitle"
              type="text"
              placeholder="Judul lesson..."
              class="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="text-xs text-gray-500 mb-1 block">Urutan</label>
                <input
                  v-model.number="lessonOrder"
                  type="number"
                  min="1"
                  class="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label class="text-xs text-gray-500 mb-1 block">Waktu Mulai (opsional)</label>
                <input
                  v-model="lessonStart"
                  type="datetime-local"
                  class="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
            <div class="flex justify-end gap-2">
              <button @click="showAddLesson = null" class="px-3 py-1.5 rounded-lg border text-xs text-gray-600 hover:bg-gray-50">Batal</button>
              <button
                @click="submitLesson(cls.id)"
                :disabled="creatingLesson"
                class="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 disabled:opacity-50"
              >
                {{ creatingLesson ? 'Menyimpan...' : 'Simpan Lesson' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
