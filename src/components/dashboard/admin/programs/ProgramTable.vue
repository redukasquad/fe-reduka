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
import type { Program } from '../../../../types/entites/program'
import { Image } from '@unpic/vue';

const props = defineProps<{
  programs: Program[]
}>()

const emit = defineEmits<{
  (e: 'edit', program: Program): void
  (e: 'delete', program: Program): void
}>()

const columnHelper = createColumnHelper<Program>()


const columns = [
  columnHelper.accessor('id', {
    header: 'No',
    enableSorting: true,
  }),
  columnHelper.accessor('programName', {
    header: 'Nama Program',
    enableSorting: true,
  }),
  columnHelper.accessor('imageProgram', {
    header: 'Gambar',
    enableSorting: false,
  }),
  columnHelper.accessor('createdAt', {
    header: 'Dijalankan Pada',
    cell: (info) =>
      new Date(info.getValue() as string).toLocaleDateString('id-ID'),
    enableSorting: true,
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Aksi',
  }),
]

const data = ref<Program[]>(props.programs)
const sorting = ref<SortingState>([])
const globalFilter = ref('')

watch(
  () => props.programs,
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
            placeholder="Cari program..."
            class="w-full max-w-sm border rounded px-3 py-2 text-sm"
        />

        <RouterLink to="programs/create" class="px-4 py-2 md:font-medium md:text-sm lg:text-lg text-xs font-semibold rounded-md bg-primary cursor-pointer text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all duration-200">
            Tambah Program
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
              class="border border-gray-300 bg-gray-100 px-3 py-2 text-left text-sm font-semibold cursor-pointer select-none text-nowrap"
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
              class="border border-gray-300 px-3 py-2 text-sm text-nowrap"
            >
              <div v-if="cell.column.id === 'imageProgram'">
                <Image
                  v-if="cell.getValue()"
                  :src="cell.getValue() as string"
                  class="h-10 w-auto rounded object-cover"
                />
                <span v-else>-</span>
              </div>

              <div v-else-if="cell.column.id === 'actions'" class="flex gap-2">
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
