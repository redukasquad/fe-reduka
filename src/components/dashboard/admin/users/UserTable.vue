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
import type { User } from '../../../../types/entites/user'

const props = defineProps<{
  users: User[]
}>()

const emit = defineEmits<{
  (e: 'change-role', user: User, role: string): void
}>()

const columnHelper = createColumnHelper<User>()


const columns = [
  columnHelper.display({
    id: 'no',
    header: 'No',
    cell: ({ row }) =>
      row.index + 1,
  }),
  columnHelper.accessor('username', {
    header: 'Nama',
    enableSorting: true,
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    enableSorting: true,
  }),
  columnHelper.accessor('role', {
    header: 'Role',
    enableSorting: true,
  }),
  columnHelper.display({
    id: 'changeTutor',
    header: 'Change to Tutor',
  }),
]

const data = ref<User[]>(props.users)
const sorting = ref<SortingState>([])
const globalFilter = ref('')

watch(
  () => props.users,
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

const isTutor = (user: User) => user.role === 'TUTOR'
</script>

<template>
  <div class="p-2 space-y-4">
    <div class="flex justify-between items-center">
      <input
        v-model="globalFilter"
        type="text"
        placeholder="Cari user..."
        class="w-full max-w-sm border rounded px-3 py-2 text-sm"
      />
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
              <div
                v-if="cell.column.id === 'changeTutor'"
                class="flex items-center gap-2"
              >
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    class="sr-only peer"
                    :checked="isTutor(row.original)"
                    @change="
                      emit(
                        'change-role',
                        row.original,
                        isTutor(row.original) ? 'STUDENT' : 'TUTOR'
                      )
                    "
                  />
                  <div
                    class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500
                           after:content-[''] after:absolute after:top-0.5 after:left-[2px]
                           after:bg-white after:border after:rounded-full after:h-5 after:w-5
                           after:transition-all peer-checked:after:translate-x-full"
                  ></div>
                </label>
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
