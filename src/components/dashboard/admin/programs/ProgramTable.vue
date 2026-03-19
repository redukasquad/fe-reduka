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
import type { Program } from '../../../../types/entites/program'
import { Image } from '@unpic/vue';
import { Icon } from '@iconify/vue';

const props = defineProps<{
  programs: Program[]
}>()

const emit = defineEmits<{
  (e: 'view', id: number): void
  (e: 'update', id: number): void
  (e: 'delete', id:number ): void
}>()

const columnHelper = createColumnHelper<Program>()


const columns = [
  columnHelper.display({
    id: 'no',
    header: 'No',
    cell: ({ row }) =>
      row.index + 1,
  }),
  columnHelper.accessor('programName', {
    header: 'Nama Program',
    enableSorting: true,
  }),
  columnHelper.accessor('imageProgram', {
    header: 'Gambar',
    enableSorting: false,
  }),
  columnHelper.accessor('CreatedAt', {
    header: 'Dibuat Pada',
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
            placeholder="Cari program..."
            class="w-full max-w-sm border rounded px-3 py-2 text-sm"
        />

        <RouterLink to="/dashboard/admin/programs/create" class="flex items-center justify-center gap-2 px-4 py-2 font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all duration-200">
            <span class="text-xl sm:hidden">+</span>
            <span class="hidden sm:inline">Tambah Program</span>
        </RouterLink>
    </div>


    <div class="overflow-x-auto" v-if="props.programs.length>0">
      <table class="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <th
              v-for="header in headerGroup.headers"
              :key="header.id"
              :colSpan="header.colSpan"
              class="border border-gray-300 bg-gray-100 px-3 py-2 text-left text-xs md:text-sm font-semibold cursor-pointer select-none text-nowrap"
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
              class="border border-gray-300 px-3 py-2 text-[12px] md:text-sm text-nowrap"
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
                    @click="emit('view', row.original.ID)"
                    class="text-blue-600 hover:text-blue-800 transition"
                    title="Lihat"
                >
                    <Icon icon="mdi:eye-outline" width="20" />
                </button>

                <button
                    @click="emit('update', row.original.ID)"
                    class="text-yellow-600 hover:text-yellow-800 transition"
                    title="Edit"
                >
                    <Icon icon="mdi:pencil-outline" width="20" />
                </button>
                <button
                    @click="emit('delete', row.original.ID)"
                    class="text-red-600 hover:text-red-800 transition"
                    title="Hapus"
                >
                    <Icon icon="mdi:delete-outline" width="20" />
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
        <div class="py-8" v-else>
            <p class="text-gray-500 text-center text-xl font-medium">
                Tidak ada program ditemukan
            </p>
            <p class="text-gray-400 text-center mt-2">
                Program akan muncul di sini ketika sudah tersedia.
            </p>
        </div>
    </div>
</template>
