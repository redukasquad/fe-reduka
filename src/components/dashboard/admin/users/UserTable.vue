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
import type { User, UserRole } from '../../../../types/entites/user'

const props = defineProps<{ users: User[] }>()

const emit = defineEmits<{
  (e: 'change-role', user: User, role: UserRole): void
  (e: 'delete', user: User): void
}>()

const ROLES: UserRole[] = ['STUDENT', 'TUTOR', 'ADMIN']

const ROLE_STYLE: Record<UserRole, string> = {
  ADMIN: 'bg-purple-100 text-purple-700',
  TUTOR: 'bg-blue-100 text-blue-700',
  STUDENT: 'bg-gray-100 text-gray-600',
}

const columnHelper = createColumnHelper<User>()

const columns = [
  columnHelper.display({
    id: 'no',
    header: 'No',
    cell: ({ row }) => row.index + 1,
  }),
  columnHelper.accessor('username', { header: 'Nama', enableSorting: true }),
  columnHelper.accessor('email', { header: 'Email', enableSorting: true }),
  columnHelper.display({ id: 'verified', header: 'Verified' }),
  columnHelper.display({ id: 'role', header: 'Role' }),
  columnHelper.display({ id: 'actions', header: 'Aksi' }),
]

const data = ref<User[]>(props.users)
const sorting = ref<SortingState>([])
const globalFilter = ref('')
const confirmDeleteId = ref<number | null>(null)

watch(() => props.users, val => (data.value = val), { deep: true })

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
      placeholder="Cari nama atau email..."
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
          <tr
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              class="px-4 py-3 whitespace-nowrap"
            >
              <!-- Verified -->
              <div v-if="cell.column.id === 'verified'">
                <span
                  :class="row.original.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-600'"
                  class="px-2 py-0.5 rounded-full text-xs font-medium"
                >
                  {{ row.original.isVerified ? 'Terverifikasi' : 'Belum' }}
                </span>
              </div>

              <!-- Role dropdown -->
              <div v-else-if="cell.column.id === 'role'" class="flex items-center gap-2">
                <span
                  :class="ROLE_STYLE[row.original.role ?? 'STUDENT']"
                  class="px-2 py-0.5 rounded-full text-xs font-semibold"
                >
                  {{ row.original.role ?? 'STUDENT' }}
                </span>
                <select
                  :value="row.original.role ?? 'STUDENT'"
                  @change="emit('change-role', row.original, ($event.target as HTMLSelectElement).value as UserRole)"
                  class="text-xs border rounded px-1.5 py-1 bg-white outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer"
                >
                  <option v-for="r in ROLES" :key="r" :value="r">{{ r }}</option>
                </select>
              </div>

              <!-- Actions -->
              <div v-else-if="cell.column.id === 'actions'" class="flex items-center gap-1">
                <template v-if="confirmDeleteId === row.original.ID">
                  <span class="text-xs text-red-500 mr-1">Yakin?</span>
                  <button
                    @click="emit('delete', row.original); confirmDeleteId = null"
                    class="px-2 py-1 rounded bg-red-500 text-white text-xs hover:bg-red-600 transition-colors"
                  >Ya</button>
                  <button
                    @click="confirmDeleteId = null"
                    class="px-2 py-1 rounded bg-gray-100 text-gray-600 text-xs hover:bg-gray-200 transition-colors"
                  >Batal</button>
                </template>
                <button
                  v-else
                  @click="confirmDeleteId = row.original.ID"
                  class="p-1.5 rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Hapus user"
                >
                  <Icon icon="mdi:delete-outline" class="text-base" />
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
