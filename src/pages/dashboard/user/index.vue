<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { Icon } from '@iconify/vue'
import { useAuth } from '../../../stores/auth'
import { CourseRegistrationService } from '../../../services/course.registration'
import { TryoutRegistrationService } from '../../../services/tryouts.registration'
import ProfileHero from '../../../components/dashboard/user/ProfileHero.vue'
import EditProfileModal from '../../../components/dashboard/user/EditProfileModal.vue'
import CourseTab from '../../../components/dashboard/user/CourseTab.vue'
import TryoutTab from '../../../components/dashboard/user/TryoutTab.vue'
import UniversityGoalsTab from '../../../components/dashboard/user/UniversityGoalsTab.vue'
import ToastNotification from '../../../components/dashboard/user/ToastNotification.vue'

const auth = useAuth()

const tabs = [
  { key: 'courses', label: 'Courses', icon: 'mdi:book-open-variant' },
  { key: 'tryouts', label: 'Try Out', icon: 'mdi:clipboard-text-outline' },
  { key: 'goals', label: 'Target Universitas', icon: 'mdi:school-outline' },
] as const
type TabKey = typeof tabs[number]['key']
const activeTab = ref<TabKey>('courses')
const showEdit = ref(false)

const { data: courseRegsData } = useQuery({
  queryKey: ['my-course-registrations'],
  queryFn: () => CourseRegistrationService.getMyRegistrations(),
  staleTime: 1000 * 60,
})
const { data: tryoutRegsData } = useQuery({
  queryKey: ['my-tryout-registrations'],
  queryFn: () => TryoutRegistrationService.getMyRegistrations(),
  staleTime: 1000 * 60,
})

const courseRegs = computed(() => courseRegsData.value?.data ?? [])
const tryoutRegs = computed(() => tryoutRegsData.value?.data ?? [])
const activeCount = computed(() => courseRegs.value.filter(r => r.status === 'approved').length)
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <ProfileHero
      :user="auth.user"
      :course-count="courseRegs.length"
      :tryout-count="tryoutRegs.length"
      :active-count="activeCount"
      @edit-profile="showEdit = true"
    />

    <!-- Tabs bar -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 mt-4">
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="flex">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            :class="[
              'flex-1 flex items-center justify-center gap-1.5 py-3.5 text-sm font-semibold transition-all duration-200 border-b-2',
              activeTab === tab.key
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            ]"
          >
            <Icon :icon="tab.icon" class="text-base" />
            <span class="hidden sm:inline">{{ tab.label }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Tab content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-5 pb-16">
      <CourseTab v-if="activeTab === 'courses'" />
      <TryoutTab v-else-if="activeTab === 'tryouts'" />
      <UniversityGoalsTab v-else-if="activeTab === 'goals'" />
    </div>

    <EditProfileModal v-model:open="showEdit" />
    <ToastNotification />
  </div>
</template>
