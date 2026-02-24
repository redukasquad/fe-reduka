<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { TryOutQuestionService } from '../../../../services/tryout.question';
import { computed } from 'vue';

const props=defineProps<{
    tryoutId:number
}>()

const {data, isLoading, isError }=useQuery({
    queryKey:['subtest-count-question', props.tryoutId],
    queryFn:async()=>{
        return await TryOutQuestionService.getSubtestQuestionCount(props.tryoutId)
    }
})


const subtest=computed(()=>(
    data.value?.data || []
))


</script>

<template>
  <div
    v-if="isLoading"
    class="p-6 text-center text-gray-500"
  >
    Memuat subtest...
  </div>

  <div
    v-else-if="isError"
    class="p-6 text-center text-red-500"
  >
    Gagal memuat data subtest.
  </div>

  <div
    v-else
    class="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4"
  >
    <Card
      v-for="s in subtest"
      :key="s.id"
      class="hover:shadow-lg transition backdrop-blur-sm"
    >
      <template #title>
        <div class="flex justify-between items-start">
          <span class="font-semibold text-sm">
            {{ s.name }}
          </span>

          <Tag
            :value="s.code"
            severity="info"
          />
        </div>
      </template>

      <template #content>
        <div class="space-y-2 text-sm">

          <div class="flex justify-between">
            <span class="text-gray-500">Jumlah Soal</span>
            <span class="font-medium">
              {{ s.questionCount }}
            </span>
          </div>

          <div class="flex justify-between">
            <span class="text-gray-500">Durasi</span>
            <span class="font-medium">
              {{ Math.floor(s.timeLimitSeconds / 60) }} menit
            </span>
          </div>

          <div class="flex justify-between">
            <span class="text-gray-500">Skor Maks</span>
            <span class="font-medium">
              {{ s.maxScore }}
            </span>
          </div>

        </div>
      </template>
    </Card>
  </div>
</template>