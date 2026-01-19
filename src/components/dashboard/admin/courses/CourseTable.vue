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
import type { Course } from '../../../../types/entites/course';

const props = defineProps<{
  courses: Course[]
}>()

const emit = defineEmits<{
  (e: 'edit', course: Course): void
  (e: 'delete', course: Course): void
  (e: 'view', course: Course): void
}>()

const columnHelper = createColumnHelper<Course>()

const columns = [
  columnHelper.accessor('nameCourse', {
    header: 'Nama Course',
    enableSorting: true,
  }),
  columnHelper.display({
    id: 'dateRange',
    header: 'Tanggal',
    cell: ({ row }) => {
      const start = new Date(row.original.startDate).toLocaleDateString('id-ID')
      const end = new Date(row.original.endDate).toLocaleDateString('id-ID')
      return `${start} - ${end}`
    },
    enableSorting: false,
  }),
  columnHelper.accessor('isFree', {
    header: 'Label',
    cell: (info) => (info.getValue() ? 'Gratis' : 'Berbayar'),
    enableSorting: true,
  }),
  columnHelper.display({
    id: 'programName',
    header: 'Program',
    cell: ({ row }) => row.original.program?.programName ?? '-',
    enableSorting: false,
  }),
  columnHelper.display({
    id: 'creatorName',
    header: 'Creator',
    cell: ({ row }) => row.original.creator?.username ?? '-',
    enableSorting: false,
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Aksi',
  }),
]

const data = ref<Course[]>(props.courses)
const sorting = ref<SortingState>([])
const globalFilter = ref('')

watch(
  () => props.courses,
  (val) => {
    data.value = val
  },
  { deep: true }
)

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
  onSortingChange: (updater) => {
    sorting.value =
      typeof updater === 'function' ? updater(sorting.value) : updater
  },
  onGlobalFilterChange: (val) => {
    globalFilter.value = String(val)
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
})
</script>

<template>
  <div class="p-2 space-y-4">
    <div class="flex justify-between items-center">
      <input
        v-model="globalFilter"
        type="text"
        placeholder="Cari course..."
        class="w-full max-w-sm border rounded px-3 py-2 text-sm"
      />
        <RouterLink to="courses/create" class="px-4 py-2 md:font-medium md:text-sm lg:text-lg text-xs font-semibold rounded-md bg-primary cursor-pointer text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all duration-200">
            Tambah Course
        </RouterLink>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <th
              v-for="header in headerGroup.headers"
              :key="header.id"
              :colSpan="header.colSpan"
              class="border border-gray-300 bg-gray-100 px-3 py-2 text-left text-sm font-semibold cursor-pointer select-none"
              @click="header.column.getToggleSortingHandler()?.($event)"
            >
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
              <span v-if="header.column.getIsSorted() === 'asc'"> ▲</span>
              <span v-else-if="header.column.getIsSorted() === 'desc'"> ▼</span>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            class="hover:bg-gray-50"
          >
            <td
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              class="border border-gray-300 px-3 py-2 text-sm"
            >
              <div v-if="cell.column.id === 'actions'" class="flex gap-2">
                <button
                  type="button"
                  @click="emit('view', row.original)"
                  class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Lihat
                </button>
                <button
                  type="button"
                  @click="emit('edit', row.original)"
                  class="text-green-600 hover:text-green-800 text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  type="button"
                  @click="emit('delete', row.original)"
                  class="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Hapus
                </button>
              </div>

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
  </div>
</template>
