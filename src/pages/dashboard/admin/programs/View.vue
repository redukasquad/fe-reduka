<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { useRoute, useRouter } from 'vue-router';
import { ProgramService } from '../../../../services/program';
import DashboardLayout from '../../../../components/layout/DashboardLayout.vue';
import { Icon } from '@iconify/vue';
import { Image } from '@unpic/vue';

const route = useRoute();
const router = useRouter();
const id = Number(route.params.id);

const { data, isLoading, isError } = useQuery({
  queryKey: ['program', id],
  queryFn: () => ProgramService.findOne(id),
  enabled: !!id,
});

</script>

<template>
  <DashboardLayout class-name="w-full py-8 backdrop-blur-sm px-6 relative">
    <RouterLink 
        to="/dashboard/admin/programs"
        class="group inline-flex items-center gap-2 rounded-lg px-3 py-2
                text-gray-600 hover:text-primary
                hover:bg-primary/10
                transition-all duration-200 absolute left-4 top-6"
        >
        <Icon
            icon="heroicons:chevron-left"
            class="text-xl transition-transform duration-200 group-hover:-translate-x-0.5"
        />
        <span class="text-sm font-medium hidden sm:inline">
            Back
        </span>
    </RouterLink>

    <div v-if="isLoading" class="text-center py-12">
      <div class="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-primary rounded-full" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <p class="mt-2 text-gray-600">Memuat detail program...</p>
    </div>

    <div v-else-if="isError" class="text-center py-12 text-red-600">
      <Icon icon="mdi:alert-circle-outline" class="text-5xl mx-auto mb-4" />
      <p class="text-xl font-semibold">Gagal memuat data program.</p>
      <button @click="router.go(0)" class="mt-4 text-primary hover:underline">Coba lagi</button>
    </div>

    <div v-else-if="data?.data" class="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mt-8 border border-gray-100">
      <div class="relative h-64 md:h-80 w-full overflow-hidden group">
        <Image 
          v-if="data.data.imageProgram" 
          :src="data.data.imageProgram" 
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div v-else class="w-full h-full from-primary/10 to-primary/5 flex items-center justify-center">
          <Icon icon="mdi:image-off-outline" class="text-6xl text-primary/30" />
        </div>
        <div class="absolute inset-0 from-black/60 via-transparent to-transparent"></div>
        <div class="absolute bottom-6 left-8 right-8">
          <h1 class="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">
            {{ data.data.programName }}
          </h1>
        </div>
      </div>

      <div class="p-8">
        <div class="flex flex-wrap items-center gap-6 mb-8 text-sm border-b border-gray-100 pb-6">
          <div class="flex items-center gap-2 text-gray-600">
            <div class="p-2 bg-blue-50 rounded-lg">
              <Icon icon="mdi:calendar-clock" class="text-xl text-blue-600" />
            </div>
            <div>
              <p class="text-[10px] uppercase font-bold text-gray-400">Dibuat Pada</p>
              <p class="font-medium">{{ new Date(data.data.CreatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2 text-gray-600">
            <div class="p-2 bg-green-50 rounded-lg">
              <Icon icon="mdi:identifier" class="text-xl text-green-600" />
            </div>
            <div>
              <p class="text-[10px] uppercase font-bold text-gray-400">ID Program</p>
              <p class="font-medium font-mono">#{{ data.data.ID }}</p>
            </div>
          </div>
        </div>

        <div class="prose prose-blue max-w-none mb-10">
          <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Icon icon="mdi:text-box-outline" class="text-primary" />
            Deskripsi Program
          </h2>
          <div class="text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-inner" v-html="data.data.description"></div>
        </div>

        <!-- Courses Section -->
        <div class="space-y-4">
          <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Icon icon="mdi:book-open-variant" class="text-primary" />
            Courses dalam Program Ini
          </h2>
          
          <div v-if="!data.data.courses || data.data.courses.length === 0" class="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <Icon icon="mdi:book-off-outline" class="text-4xl text-gray-300 mx-auto mb-2" />
            <p class="text-gray-500 italic">Belum ada course yang dikaitkan dengan program ini.</p>
          </div>
          
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="course in data.data.courses" :key="course.id" class="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all group">
              <div class="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                <Image v-if="course.image" :src="course.image" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full bg-primary/5 flex items-center justify-center">
                  <Icon icon="mdi:book-open-outline" class="text-2xl text-primary/30" />
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-bold text-gray-800 truncate group-hover:text-primary transition-colors">
                  {{ course.nameCourse }}
                </h3>
                <div class="flex items-center gap-2 mt-1">
                  <span :class="[course.isFree ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600', 'px-2 py-0.5 rounded text-[10px] font-bold uppercase']">
                    {{ course.isFree ? 'Gratis' : 'Berbayar' }}
                  </span>
                  <span class="text-[10px] text-gray-400">
                    {{ new Date(course.startDate).toLocaleDateString('id-ID') }}
                  </span>
                </div>
              </div>
              <RouterLink :to="`/dashboard/admin/courses/${course.id}`" class="p-2 text-gray-300 hover:text-primary transition-colors">
                <Icon icon="mdi:chevron-right" class="text-2xl" />
              </RouterLink>
            </div>
          </div>
        </div>

        <div class="mt-10 flex justify-end gap-3 border-t border-gray-100 pt-8">
          <RouterLink 
            :to="`/dashboard/admin/programs/update/${data.data.ID}`"
            class="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <Icon icon="mdi:pencil" />
            Edit Program
          </RouterLink>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>