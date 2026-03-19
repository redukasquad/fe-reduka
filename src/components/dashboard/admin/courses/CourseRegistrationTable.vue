<script setup lang="ts">
import {
  FlexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useVueTable,
  createColumnHelper,
  type SortingState,
} from '@tanstack/vue-table'
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import type { CourseRegistration } from '../../../../types/entites/courseRegistration'

const props = defineProps<{ registrations: CourseRegistration[] }>()

const emit = defineEmits<{
  (e: 'view', id: number): void
  (e: 'approve', id: number): void
  (e: 'reject', id: number): void
}>()

const columnHelper = createColumnHelper<CourseRegistration>()

const columns = [
  columnHelper.display({
    id: 'no',
    header: 'No',
    cell: ({ row }) => row.index + 1,
  }),
  columnHelper.display({
    id: 'user',
    header: 'Peserta',
    cell: ({ row }) => row.original.userName ?? '-',
  }),
  columnHelper.display({
    id: 'email',
    header: 'Email',
    cell: ({ row }) => row.original.userEmail ?? '-',
  }),
  columnHelper.display({
    id: 'course',
    header: 'Kursus',
    cell: ({ row }) => row.original.courseName ?? '-',
  }),
  columnHelper.accessor('status', { header: 'Status' }),
  columnHelper.accessor('createdAt', {
    header: 'Tanggal Daftar',
    cell: info => new Date(info.getValue() as string).toLocaleDateString('id-ID'),
  }),
  columnHelper.display({ id: 'actions', header: 'Aksi' }),
]

const data = ref<CourseRegistration[]>(props.registrations)
const sorting = ref<SortingState>([])
const globalFilter = ref('')

watch(() => props.registrations, val => (data.value = val), { deep: true })

const table = useVueTable({
  get data() { return data.value },
  columns,
  state: {
    get sorting() { return sorting.value },
    get globalFilter() { return globalFilter.value },
  },
  onSortingChange: u => { sorting.value = typeof u === 'function' ? u(sorting.value) : u },
  onGlobalFilterChange: v => { globalFilter.value = String(v) },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
})
</script>

<template>
  <div class="p-4 space-y-4">
    <input
      v-model="globalFilter"
      type="text"
      placeholder="Cari peserta atau kursus..."
      class="w-full max-w-sm border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
    />

    <div class="overflow-x-auto rounded-lg border">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-50 border-b">
          <tr v-for="hg in table.getHeaderGroups()" :key="hg.id">
            <th
              v-for="h in hg.headers"
              :key="h.id"
              :colSpan="h.colSpan"
              class="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer select-none whitespace-nowrap"
              @click="h.column.getToggleSortingHandler()?.($event)"
            >
              <span class="flex items-center gap-1">
                <FlexRender v-if="!h.isPlaceholder" :render="h.column.columnDef.header" :props="h.getContext()" />
                <Icon v-if="h.column.getIsSorted() === 'asc'" icon="mdi:arrow-up" class="text-xs" />
                <Icon v-else-if="h.column.getIsSorted() === 'desc'" icon="mdi:arrow-down" class="text-xs" />
              </span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="row in table.getRowModel().rows" :key="row.id" class="hover:bg-gray-50 transition-colors">
            <td v-for="cell in row.getVisibleCells()" :key="cell.id" class="px-4 py-3 whitespace-nowrap">

              <!-- Status badge -->
              <div v-if="cell.column.id === 'status'">
                <span
                  :class="{
                    'bg-yellow-100 text-yellow-700': cell.getValue() === 'pending',
                    'bg-green-100 text-green-700': cell.getValue() === 'approved',
                    'bg-red-100 text-red-600': cell.getValue() === 'rejected',
                  }"
                  class="px-2.5 py-1 rounded-full text-xs font-semibold capitalize"
                >
                  {{ cell.getValue() as string }}
                </span>
              </div>

              <!-- Actions -->
              <div v-else-if="cell.column.id === 'actions'" class="flex items-center gap-2">
                <button
                  @click="emit('view', row.original.id)"
                  class="p-1.5 rounded-md text-blue-500 hover:bg-blue-50 transition-colors"
                  title="Detail"
                >
                  <Icon icon="mdi:eye-outline" class="text-base" />
                </button>
                <button
                  v-if="row.original.status === 'pending'"
                  @click="emit('approve', row.original.id)"
                  class="p-1.5 rounded-md text-green-600 hover:bg-green-50 transition-colors"
                  title="Setujui"
                >
                  <Icon icon="mdi:check-circle-outline" class="text-base" />
                </button>
                <button
                  v-if="row.original.status === 'pending'"
                  @click="emit('reject', row.original.id)"
                  class="p-1.5 rounded-md text-red-500 hover:bg-red-50 transition-colors"
                  title="Tolak"
                >
                  <Icon icon="mdi:close-circle-outline" class="text-base" />
                </button>
              </div>

              <!-- Default -->
              <template v-else>
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </template>

            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
