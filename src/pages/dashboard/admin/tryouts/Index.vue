<script setup lang="ts">
import { useMutation, useQuery, keepPreviousData } from '@tanstack/vue-query'
import { computed, reactive, watch } from 'vue'
import DashboardLayout from '../../../../components/layout/DashboardLayout.vue'
import { TryoutService } from '../../../../services/tryout'
import TryoutTable from '../../../../components/dashboard/admin/tryouts/TryoutTable.vue'
import { useRouter, useRoute } from 'vue-router'
import { toast } from 'vue3-toastify'

const router = useRouter()
const route = useRoute()

const query = reactive({
  q: String(route.query.q ?? ''),
  page: Number(route.query.page ?? 1),
  perPage: Number(route.query.perPage ?? 10),
})

watch(
  () => route.query,
  (val) => {
    query.q = String(val.q ?? '')
    query.page = Number(val.page ?? 1)
    query.perPage = Number(val.perPage ?? 10)
  }
)

watch(
  () => ({ ...query }),
  (val) => {
    router.replace({
      query: {
        q: val.q || undefined,
        page: String(val.page),
        perPage: String(val.perPage),
      },
    })
  },
  { deep: true }
)

const { data, refetch, isLoading, isError } = useQuery({
  queryKey: ['tryouts', query.q, query.page, query.perPage],
  queryFn: () => TryoutService.findAll(query),
  placeholderData: keepPreviousData,
})

const tryouts = computed(() => data.value?.data?.data ?? [])

const metaData = computed(() => {
  const m = data.value?.data
  return {
    page: m?.page ?? query.page,
    perPage: m?.perPage ?? query.perPage,
    totalItems: m?.totalItems ?? 0,
    totalPages: m?.totalPages ?? 1,
  }
})

const tryoutMutation = useMutation({
  mutationFn: async (id: number) => {
    await TryoutService.delete(id)
  },
  onSuccess: () => {
    refetch()
    toast('Successfully deleted', { type: 'success' })
  },
})

const handleView = (id: number) => {
  router.push({ name: 'admin-tryouts-view', params: { id: id } })
}

const handleUpdate = (id: number) => {
  router.push({ name: 'admin-tryouts-update', params: { id: id } })
}

const handleDelete = (id: number) => {
  tryoutMutation.mutate(id)
}

const publishMutation = useMutation({
  mutationFn: async ({ id, isPublished }: { id: number; isPublished: boolean }) => {
    await TryoutService.togglePublish(id, isPublished)
  },
  onSuccess: () => {
    refetch()
    toast('Status publikasi diperbarui', { type: 'success' })
  },
})

const handleTogglePublish = (id: number, value: boolean) => {
  publishMutation.mutate({ id, isPublished: value })
}

const handlePageChange = (page: number) => {
  query.page = page
  refetch()
}

const handlePerPageChange = (perPage: number) => {
  query.perPage = perPage
  query.page = 1
  refetch()
}

const handleSearch = (q: string) => {
  query.q = q
  query.page = 1
  refetch()
}


</script>

<template>
  <DashboardLayout>
    <div class="backdrop-blur min-h-screen px-4">
      <div class="bg-white/20 rounded-lg shadow overflow-hidden">
        <h1 class="text-2xl font-bold p-4 text-gray-800">Daftar Tryouts</h1>

        <div v-if="isLoading" class="p-8 text-center text-gray-600">
          Memuat data...
        </div>

        <div v-else-if="isError" class="p-8 text-center text-red-600">
          Gagal memuat data tryouts.
        </div>

        <div v-else>
          <TryoutTable
            :tryouts="tryouts"
            :meta="metaData"
            :q="query.q"
            @view="handleView"
            @update="handleUpdate"
            @delete="handleDelete"
            @toggle-publish="handleTogglePublish"
            @page-change="handlePageChange"
            @per-page-change="handlePerPageChange"
            @search="handleSearch"
          />
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>