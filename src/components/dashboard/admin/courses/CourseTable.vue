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
import { Icon } from '@iconify/vue'

const props = defineProps<{
  courses: Course[]
}>()

const emit = defineEmits<{
  (e: 'delete', id:number ): void
  (e: 'view', course: Course): void
}>()

const columnHelper = createColumnHelper<Course>()

const columns = [
  columnHelper.display({
    id: 'no',
    header: 'No',
    cell: ({ row }) => row.index + 1,
    enableSorting: false,
  }),
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
    id: 'registration',
    header: 'Registrations',
    enableSorting: false,
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Aksi',
    enableSorting: false,
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

const fuzzyFilter: FilterFn<any> = (row, columnId, value) => {
  const cellValue = row.getValue(columnId)
  return String(cellValue)
    .toLowerCase()
    .includes(String(value).toLowerCase())
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
    <div class="flex justify-between items-center gap-4">
      <input
        v-model="globalFilter"
        type="text"
        placeholder="Cari course..."
        class="w-full max-w-xs border rounded px-3 py-2 text-sm"
      />
      <RouterLink
        to="/dashboard/admin/courses/create"
        class="px-4 py-2 md:font-medium md:text-sm lg:text-lg text-xs text-nowrap font-semibold rounded-md bg-primary cursor-pointer text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all duration-200"
      >
       <span class="md:block hidden">Tambah Course</span>
       <Icon icon="mdi:plus" class="md:hidden block" />
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
              :class="[
                'border border-gray-300 bg-gray-100 px-3 py-2 text-left text-sm font-semibold select-none',
                header.column.getCanSort() ? 'cursor-pointer' : 'cursor-default',
              ]"
              @click="
                header.column.getCanSort() &&
                header.column.getToggleSortingHandler()?.($event)
              "
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
              class="border border-gray-300 px-3 py-2 text-[10px] text-nowrap"
            >
              <div v-if="cell.column.id === 'actions'" class="flex gap-2">
                <button
                  type="button"
                  @click="emit('view', row.original)"
                  class="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Lihat
                </button>
                <button
                  type="button"
                  @click="emit('delete', row.original.id)"
                  class="text-red-600 hover:text-red-800 font-medium"
                >
                  Hapus
                </button>
              </div>

              <div
                v-else-if="cell.column.id === 'registration'"
                class="flex items-center gap-1 text-nowrap text-[10px] text-gray-600"
              >
                <Icon icon="mdi:users-group" width="13" height="13" class="text-green-400" />
                {{ 10 }} registered
                <RouterLink
                  :to="`/dashboard/admin/courses/${row.original.id}/registrations`"
                  class="ml-auto hover:scale-105 transition-all duration-200 text-green-400 hover:text-yellow-500"
                >
                  <Icon icon="mdi:arrow-top-right" width="10" height="10" />
                </RouterLink>
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
