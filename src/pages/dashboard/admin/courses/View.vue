<script setup lang="ts">
import { computed, ref } from 'vue'
import { CourseService } from '../../../../services/course'
import { useQuery } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'
import DashboardLayout from '../../../../components/layout/DashboardLayout.vue'
import { Image } from '@unpic/vue'
import { Icon } from '@iconify/vue'
import FormSubject from '../../../../components/dashboard/admin/courses/FormSubject.vue'
import ListQuestionView from '../../../../components/dashboard/admin/courses/ListQuestionView.vue'
import ListTutorView from '../../../../components/dashboard/admin/courses/ListTutorView.vue'

const route = useRoute()

const { data, isLoading, isError } = useQuery({
  queryKey: ['course', route.params.id],
  queryFn: () => CourseService.findOne(String(route.params.id)),
  enabled: computed(() => !!route.params.id),
})

const showSubject = ref<number | null>(null)
const showAddSubject = ref(false)
const activeTab = ref('0')

const course = computed(() => data.value?.data || null)

const removeSubject = (id: number) => {
  console.log('hapus subject', id)
}

const tabs = [
  {
    title: 'All Question',
    value: '0',
    component: ListQuestionView
  },
  {
    title: 'All Tutor',
    value: '1',
    component: ListTutorView
  },
]
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

      <div class="flex md:flex-row flex-col gap-4 items-start border-b-2 border-b-gray-300 pb-4 rounded-b-md">
        <div class="flex-1">
          <Image
            :src="course.imageCourse || 'https://buildwithangga.com/themes/front/images/landing-page/privilege/keuntungan%20utama%20belajar%20ui%20ux%20coding%20di%20BuildWithAngga.png'"
            class="w-full h-auto"
            :alt="course.nameCourse + '-image'"
          />
        </div>
        <div class="flex-1 space-y-0.5">
          <h1 class="lg:text-3xl md:text-2xl sm:text-xl text-lg text-center font-bold">
            {{ course.nameCourse }}
          </h1>
          <p class="text-sm opacity-90">{{ course.description }}</p>
        </div>
      </div>

      <h2 class="text-2xl font-semibold text-center my-2">Subjects</h2>
      <div class="flex items-start gap-2 md:flex-row flex-col">
        <div class="flex-1 flex-wrap flex gap-4 items-center">
          <Button
            v-for="(value,i) in course.subjects"
            :key="value.ID"
            @click="showSubject = i"
            class="flex text-nowrap items-center gap-1.5 text-xs"
          >
            {{ value.name }}
            <Icon
              icon="mdi:close"
              class="hover:text-red-400"
              @click.stop="removeSubject(value.ID)"
            />
          </Button>

          <Button @click="showAddSubject = !showAddSubject" variant="outlined" class="flex items-center text-nowrap gap-1.5 text-xs">
            <Icon icon="mdi:plus" />
            Tambah subject
          </Button>
        </div>

        <div class="flex-1">
          <div v-if="showSubject !== null">
            {{ course.subjects && course.subjects[showSubject]?.description }}
          </div>
          <div v-else class="text-gray-400 italic">
            Pilih subject untuk melihat deskripsi
          </div>
        </div>
      </div>

      <Tabs v-model:value="activeTab" class="mt-4">
        <TabList>
          <Tab v-for="tab in tabs" :key="tab.value" :value="tab.value">
            {{ tab.title }}
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel v-for="tab in tabs" :key="tab.value" :value="tab.value">
            <component :is="tab.component" />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>

    <FormSubject v-model:visible="showAddSubject" :courseId="route.params.id as string" />
  </DashboardLayout>
</template>
