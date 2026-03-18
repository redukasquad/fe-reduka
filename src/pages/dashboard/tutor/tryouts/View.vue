<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import CardCountSubtest from '../../../../components/dashboard/tutor/tryouts/CardCountSubtest.vue'
import DashboardLayout from '../../../../components/layout/DashboardLayout.vue'
import { useQuery } from '@tanstack/vue-query'
import { TryOutQuestionService } from '../../../../services/tryout.question'
import { computed, ref, watch } from 'vue'
import FormCreateQuestion from '../../../../components/dashboard/tutor/tryouts/FormCreateQuestion.vue'
import { Icon } from '@iconify/vue'

const route = useRoute()
const router = useRouter()

const tryoutId = Number(route.params.id)
const visibleCreateQuestion=ref(false)

const showQuestion = ref((route.query.watch as string) || 'All')
const q = ref((route.query.q as string) || '')

const toggleShowQuestion = (value: string) => {
  showQuestion.value = value
}

watch(showQuestion, (newVal) => {
  router.replace({
    query: {
      ...route.query,
      watch: newVal
    }
  })
})

let debounceTimer: number | undefined

const onChangeSearch = (e: Event) => {
  const target = e.target as HTMLInputElement
  const value = target.value

  clearTimeout(debounceTimer)

  debounceTimer = window.setTimeout(() => {
    q.value = value

    router.replace({
      query: {
        ...route.query,
        q: value || undefined
      }
    })
  }, 500)
}

const { data, isLoading, isError } = useQuery({
  queryKey: ['subtest-count-question', tryoutId],
  queryFn: async () => {
    return await TryOutQuestionService.getSubtestQuestionCount(tryoutId)
  }
})

const subtest = computed(() => data.value?.data ?? [])
</script>

<template>
  <DashboardLayout class="px-4 space-y-2">
    <div>
      Grafik view
    </div>

    <CardCountSubtest
      :is-loading="isLoading"
      :is-error="isError"
      :subtest="subtest"
    />

    <div class="mt-6 pb-4">
      <h2 class="text-xl md:text-2xl font-semibold text-center">
        All Question
      </h2>

      <div class="w-full flex justify-start md:gap-4 gap-2 mt-4 flex-wrap">
        <Button :variant="showQuestion=='All'?'default':'outlined'"  class="text-sm" @click="toggleShowQuestion('All')">
          All
        </Button>

        <Button
          v-for="(item, index) in subtest"
          :key="index"
          class="text-sm"
          :variant="showQuestion==item.code?'default':'outlined'"
          @click="toggleShowQuestion(item.code)"
        >
          {{ item.code }}
        </Button>
      </div>

      <div class="mt-4">
        <div class="flex justify-between items-center gap-4">
          <input
            type="text"
            :value="q"
            placeholder="Search question..."
            class="border rounded px-3 py-2 w-full max-w-sm"
            @input="onChangeSearch"
          />
          <Button variant="outline" @click="visibleCreateQuestion=!visibleCreateQuestion">
            <Icon icon="mdi:plus" />
          </Button>
        </div>
        <FormCreateQuestion v-model:visible="visibleCreateQuestion" :subtest="subtest" :tryout-id="tryoutId" />
      </div>
    </div>
  </DashboardLayout>
</template>