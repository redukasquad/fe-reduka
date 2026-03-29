<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import DashboardLayout from '../../../components/layout/DashboardLayout.vue';
import { Icon } from '@iconify/vue';
import { ProgramService } from '../../../services/program';
import { CourseService } from '../../../services/course';
import { TryoutService } from '../../../services/tryout';
import { UserService } from '../../../services/user';
import { computed } from 'vue';

const { data: programsData, isLoading: loadingPrograms } = useQuery({
  queryKey: ['programs-count'],
  queryFn: ProgramService.findAll,
});

const { data: coursesData, isLoading: loadingCourses } = useQuery({
  queryKey: ['courses-count'],
  queryFn: () => CourseService.findAll({ q: '', page: 1, perPage: 1 }),
});

const { data: tryoutsData, isLoading: loadingTryouts } = useQuery({
  queryKey: ['tryouts-count'],
  queryFn: () => TryoutService.findAll({ q: '', page: 1, perPage: 1 }),
});

const { data: usersData, isLoading: loadingUsers } = useQuery({
  queryKey: ['users-count'],
  queryFn: UserService.findAll,
});

const stats = computed(() => [
  {
    label: 'Total Program',
    value: programsData.value?.data?.length || 0,
    icon: 'mdi:format-list-bulleted-type',
    color: 'bg-blue-500',
    loading: loadingPrograms.value,
  },
  {
    label: 'Total Course',
    value: coursesData.value?.data?.totalItems || 0,
    icon: 'mdi:book-open-variant',
    color: 'bg-green-500',
    loading: loadingCourses.value,
  },
  {
    label: 'Total Tryout',
    value: tryoutsData.value?.data?.totalItems || 0,
    icon: 'mdi:pencil-box-outline',
    color: 'bg-purple-500',
    loading: loadingTryouts.value,
  },
  {
    label: 'Total Pengguna',
    value: usersData.value?.data?.length || 0,
    icon: 'mdi:account-group',
    color: 'bg-orange-500',
    loading: loadingUsers.value,
  },
]);

const recentPrograms = computed(() => {
  return programsData.value?.data?.slice(0, 5) || [];
});

const recentUsers = computed(() => {
  return usersData.value?.data?.slice(0, 5) || [];
});
</script>

<template>
  <DashboardLayout>
    <div class="p-6 space-y-8 backdrop-blur-md">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Dashboard Admin</h1>
        <p class="text-gray-500 mt-1">Selamat datang kembali! Berikut ringkasan statistik Reduka.</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="stat in stats" :key="stat.label" 
             class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-5 transition-all hover:shadow-md">
          <div :class="[stat.color, 'p-4 rounded-xl text-white shadow-lg shadow-opacity-20']">
            <Icon :icon="stat.icon" class="text-3xl" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">{{ stat.label }}</p>
            <div v-if="stat.loading" class="h-8 w-12 bg-gray-100 animate-pulse rounded mt-1"></div>
            <p v-else class="text-2xl font-bold text-gray-800">{{ stat.value }}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Recent Programs -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="p-5 border-b border-gray-50 flex justify-between items-center">
            <h2 class="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Icon icon="mdi:lightning-bolt" class="text-yellow-500" />
              Program Terbaru
            </h2>
            <RouterLink to="/dashboard/admin/programs" class="text-sm font-semibold text-primary hover:underline">Lihat Semua</RouterLink>
          </div>
          <div class="p-2">
            <div v-if="loadingPrograms" class="p-4 space-y-3">
              <div v-for="i in 3" :key="i" class="h-12 bg-gray-50 animate-pulse rounded-lg"></div>
            </div>
            <div v-else-if="recentPrograms.length === 0" class="p-12 text-center text-gray-400 italic">
              Belum ada program yang dibuat.
            </div>
            <div v-else class="divide-y divide-gray-50">
              <div v-for="program in recentPrograms" :key="program.ID" class="p-4 flex items-center justify-between hover:bg-gray-50 rounded-xl transition-colors">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary overflow-hidden">
                    <img v-if="program.imageProgram" :src="program.imageProgram" class="w-full h-full object-cover" />
                    <Icon v-else icon="mdi:image-outline" class="text-xl" />
                  </div>
                  <div>
                    <p class="font-semibold text-gray-800 text-sm">{{ program.programName }}</p>
                    <p class="text-[10px] text-gray-400">{{ new Date(program.CreatedAt).toLocaleDateString('id-ID') }}</p>
                  </div>
                </div>
                <RouterLink :to="`/dashboard/admin/programs/view/${program.ID}`" class="p-2 text-gray-400 hover:text-primary transition-colors">
                  <Icon icon="mdi:chevron-right" class="text-xl" />
                </RouterLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Users -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="p-5 border-b border-gray-50 flex justify-between items-center">
            <h2 class="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Icon icon="mdi:account-clock" class="text-blue-500" />
              Pengguna Terbaru
            </h2>
            <RouterLink to="/dashboard/admin/users" class="text-sm font-semibold text-primary hover:underline">Lihat Semua</RouterLink>
          </div>
          <div class="p-2">
            <div v-if="loadingUsers" class="p-4 space-y-3">
              <div v-for="i in 3" :key="i" class="h-12 bg-gray-50 animate-pulse rounded-lg"></div>
            </div>
            <div v-else-if="recentUsers.length === 0" class="p-12 text-center text-gray-400 italic">
              Belum ada pengguna terdaftar.
            </div>
            <div v-else class="divide-y divide-gray-50">
              <div v-for="user in recentUsers" :key="user.ID" class="p-4 flex items-center justify-between hover:bg-gray-50 rounded-xl transition-colors">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 overflow-hidden">
                    <Icon icon="mdi:account" class="text-xl" />
                  </div>
                  <div>
                    <p class="font-semibold text-gray-800 text-sm">{{ user.username }}</p>
                    <p class="text-[10px] text-gray-400">{{ user.email }}</p>
                  </div>
                </div>
                <div class="px-2 py-1 rounded text-[10px] font-bold uppercase" 
                     :class="user.role === 'ADMIN' ? 'bg-red-100 text-red-600' : user.role === 'TUTOR' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'">
                  {{ user.role }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>
