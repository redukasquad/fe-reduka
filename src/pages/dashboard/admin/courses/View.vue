<script setup lang="ts">
import { computed, ref } from 'vue'
import { CourseService } from '../../../../services/course'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'
import DashboardLayout from '../../../../components/layout/DashboardLayout.vue'
import { Image } from '@unpic/vue'
import { Icon } from '@iconify/vue'
import FormSubject from '../../../../components/dashboard/admin/courses/FormSubject.vue'
import ListQuestionView from '../../../../components/dashboard/admin/courses/ListQuestionView.vue'
import { CourseSubjectService } from '../../../../services/course.subject'
import { toast } from 'vue3-toastify'

const route = useRoute()

const { data, isLoading, isError, refetch } = useQuery({
  queryKey: ['course', Number(route.params.id)],
  queryFn: () => CourseService.findOne(Number(route.params.id)),
  enabled: computed(() => !!route.params.id),
})

const showSubject = ref<number | null>(null)
const showAddSubject = ref(false)

const course = computed(() => data.value?.data || null)


const mutate = useMutation<
  unknown,
  Error,
  number
>({
  mutationFn: async (subjectId: number) =>
    await CourseSubjectService.remove(subjectId),

  onSuccess: () => {
    refetch()
    toast('Successfully deleted subject', { type: 'success' })
  }
})


const currentSubject = computed(() => {
  if (showSubject.value === null) return null
  return course.value?.subjects?.[showSubject.value] ?? null
})

</script>

<template>
  <DashboardLayout class="backdrop-blur">
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="isError">Error loading course</div>

    <div v-else-if="course" class="py-4 px-8 relative">
      <RouterLink
        :to="{ name: 'admin-courses' }"
        class="p-1 rounded-full shadow bg-gray-500 text-white text-2xl absolute top-5 left-4 z-30"
      >
        <Icon icon="mdi:chevron-left" />
      </RouterLink>

      <RouterLink
        :to="{ name: 'admin-courses-update',params:{ id:course.id } }"
        class="p-2 rounded-full  group shadow-xl shadow-blue-400/40 hover:scale-105 bg-blue-400 text-white text-2xl absolute top-5 right-7 z-30"
      >
        <div class="relative">
          <p class="absolute top-[250%] left-1/2 -translate-x-1/2 text-[10px] bg-gray-800 text-white p-1 rounded-sm scale-0 group-hover:scale-100 transition-all duration-500 text-nowrap">Update Course</p>
          <Icon icon="mdi:pen" class="size-2" />
        </div>
      </RouterLink>

      <div class="flex md:flex-row flex-col gap-4 items-center border-b-2 border-b-gray-300 pb-4 rounded-b-md">
        <div class="flex-1">
          <Image
            :src="course.imageCourse || 'https://buildwithangga.com/themes/front/images/landing-page/privilege/keuntungan%20utama%20belajar%20ui%20ux%20coding%20di%20BuildWithAngga.png'"
            class="w-full h-auto"
            :alt="course.nameCourse + '-image'"
          />
        </div>
        <div class="flex-1  space-y-0.5">
          <h1 class="lg:text-3xl md:text-2xl sm:text-xl text-lg text-center font-bold">
            {{ course.nameCourse }}
          </h1>
          <p class="text-sm text-justify opacity-90">{{ course.description }}</p>
        </div>
      </div>

      <h2 class="text-2xl font-bold text-center my-2">Subjects</h2>
      <div class="flex items-start gap-2 md:flex-row flex-col transition-all duration-200">
        <div class="flex-1 flex-wrap flex gap-1 items-center">
          <button
            v-for="(value,i) in course.subjects"
            :key="value.id"
            @click="showSubject = i"
            class="flex text-nowrap items-center gap-1.5 text-xs bg-primary/80 text-white p-2 rounded"
          >
            {{ value.name }}
            <Icon
              icon="mdi:close"
              class="hover:text-red-400"
              @click.stop="mutate.mutate(value.id)"
            />
          </button>

          <Button @click="showAddSubject = !showAddSubject" size="small" variant="outlined" class="flex items-center text-nowrap gap-1.5 text-[10px]">
            <Icon icon="mdi:plus" />
            Tambah subject
          </Button>
        </div>

        <div v-if="showSubject !== null" class="flex-1 relative">
          <div v-if="showSubject !== null" class="text-sm">
            <div v-if="!currentSubject?.description" class="text-gray-400 text-sm">
              Subject ini tidak memiliki deskripsi
            </div>

            <div v-else v-html="currentSubject.description"></div>
          </div>
          <button @click="showSubject=null" class="absolute -top-8 right-4 z-20 p-1 bg-gray-100 rounded-full cursor-pointer">
            <Icon
              icon="mdi:close"
              class="hover:text-red-400"
            />
          </button>
        </div>
      </div>

      <ListQuestionView :courseId="course.id" />
    </div>

    <FormSubject v-model:visible="showAddSubject" :courseId="Number(route.params.id)" />
  </DashboardLayout>
</template>
