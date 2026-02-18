<script setup lang="ts">
import {
  FlexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useVueTable,
  createColumnHelper,
  type SortingState,
  type FilterFn,
} from '@tanstack/vue-table'
import { ref, watch } from 'vue'
import type { Course } from '../../../../types/entites/course'
import ColRegistered from './ColRegistered.vue'

const props = defineProps<{
  courses: Course[]
  meta: {
    page: number
    perPage: number
    totalItems: number
    totalPages: number
  }
  q: string
}>()

const emit = defineEmits<{
  (e: 'delete', id: number): void
  (e: 'view', course: Course): void
  (e: 'page-change', page: number): void
  (e: 'per-page-change', perPage: number): void
  (e: 'search', q: string): void
}>()

const columnHelper = createColumnHelper<Course>()

const columns = [
  columnHelper.display({
    id: 'no',
    header: 'No',
    cell: ({ row }) =>
      (props.meta.page - 1) * props.meta.perPage + row.index + 1,
  }),

  columnHelper.accessor('nameCourse', {
    header: 'Nama Course',
  }),

  columnHelper.display({
    id: 'dateRange',
    header: 'Tanggal',
    cell: ({ row }) => {
      const start = new Date(row.original.startDate).toLocaleDateString('id-ID')
      const end = new Date(row.original.endDate).toLocaleDateString('id-ID')
      return `${start} - ${end}`
    },
  }),

  columnHelper.accessor('isFree', {
    header: 'Label',
    cell: info => (info.getValue() ? 'Gratis' : 'Berbayar'),
  }),

  columnHelper.display({
    id: 'programName',
    header: 'Program',
    cell: ({ row }) => row.original.program?.programName ?? '-',
  }),

  columnHelper.display({
    id: 'registration',
    header: 'Registrations',
  }),

  columnHelper.display({
    id: 'actions',
    header: 'Aksi',
  }),
]

const data = ref<Course[]>(props.courses)
const sorting = ref<SortingState>([])
const globalFilter = ref(props.q)

watch(() => props.courses, v => (data.value = v), { deep: true })
watch(() => props.q, v => (globalFilter.value = v))

const fuzzyFilter: FilterFn<any> = (row, columnId, value) => {
  const cellValue = row.getValue(columnId)
  return String(cellValue).toLowerCase().includes(String(value).toLowerCase())
}

const table = useVueTable({
  get data() {
    return data.value
  },
  columns,
  state: {
    get sorting() {
      return sorting.value
    },
    get globalFilter() {
      return globalFilter.value
    },
  },
  globalFilterFn: fuzzyFilter,
  onGlobalFilterChange: val => {
    const v = String(val)
    globalFilter.value = v
    emit('search', v)
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
})
</script>

<template>
  <div class="p-2 space-y-4">
    <div class="flex justify-between items-center gap-4">
      <input
        v-model="globalFilter"
        type="text"
        placeholder="Cari course..."
        class="w-full max-w-xs border rounded px-3 py-2 text-sm"
      />

      <RouterLink
        to="/dashboard/admin/courses/create"
        class="px-4 py-2 font-semibold rounded-md bg-primary text-primary-foreground"
      >
        Tambah Course
      </RouterLink>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full border border-gray-300">
        <thead>
          <tr v-for="hg in table.getHeaderGroups()" :key="hg.id">
            <th
              v-for="h in hg.headers"
              :key="h.id"
              :colSpan="h.colSpan"
              class="border px-3 py-2 bg-gray-100 text-sm"
            >
              <FlexRender
                v-if="!h.isPlaceholder"
                :render="h.column.columnDef.header"
                :props="h.getContext()"
              />
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="row in table.getRowModel().rows" :key="row.id">
            <td
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              class="border px-3 py-2 text-[12px]"
            >
              <div v-if="cell.column.id === 'actions'" class="flex gap-2">
                <button
                  @click="emit('view', row.original)"
                  class="text-blue-600"
                >
                  Lihat
                </button>

                <button
                  @click="emit('delete', row.original.id)"
                  class="text-red-600"
                >
                  Hapus
                </button>
              </div>

              <ColRegistered
                v-else-if="cell.column.id === 'registration'"
                :id="row.original.id"
              />

              <template v-else>
                <FlexRender
                  :render="cell.column.columnDef.cell"
                  :props="cell.getContext()"
                />
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex items-center justify-between pt-2">
      <div class="flex items-center gap-2">
        <span class="text-sm">Rows:</span>
        <select
          :value="meta.perPage"
          @change="
            e =>
              emit(
                'per-page-change',
                Number((e.target as HTMLSelectElement).value)
              )
          "
          class="border rounded px-2 py-1 text-sm"
        >
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
        </select>
      </div>

      <div class="flex items-center gap-1">
        <button
          class="px-2 py-1 border rounded"
          :disabled="meta.page <= 1"
          @click="emit('page-change', meta.page - 1)"
        >
          Prev
        </button>

        <button
          v-for="p in meta.totalPages"
          :key="p"
          class="px-3 py-1 border rounded"
          :class="p === meta.page ? 'bg-blue-600 text-white' : ''"
          @click="emit('page-change', p)"
        >
          {{ p }}
        </button>

        <button
          class="px-2 py-1 border rounded"
          :disabled="meta.page >= meta.totalPages"
          @click="emit('page-change', meta.page + 1)"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>
