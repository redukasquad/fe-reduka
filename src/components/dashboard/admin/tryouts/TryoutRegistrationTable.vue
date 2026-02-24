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
import { Image } from '@unpic/vue'
import { Icon } from '@iconify/vue'
import type { TryOutRegistration } from '../../../../types/entites/tryout.registration'

const props = defineProps<{
  registrations: TryOutRegistration[]
}>()

const emit = defineEmits<{
  (e: 'view', id: number): void
  (e: 'approve', id: number): void
  (e: 'reject', id: number): void
}>()

const columnHelper = createColumnHelper<TryOutRegistration>()

const columns = [
  columnHelper.display({
    id: 'no',
    header: 'No',
    cell: ({ row }) => row.index + 1,
  }),

  columnHelper.display({
    id: 'user',
    header: 'Peserta',
    cell: ({ row }) => row.original.user?.username ?? '-',
  }),

  columnHelper.display({
    id: 'package',
    header: 'Paket Tryout',
    cell: ({ row }) => row.original.tryOut?.name ?? '-',
  }),

  columnHelper.accessor('paymentProofUrl', {
    header: 'Bukti',
    enableSorting: false,
  }),

  columnHelper.accessor('paymentStatus', {
    header: 'Status',
  }),

  columnHelper.accessor('registeredAt', {
    header: 'Tanggal Daftar',
    cell: info =>
      new Date(info.getValue() as string).toLocaleDateString('id-ID'),
  }),

  columnHelper.display({
    id: 'actions',
    header: 'Aksi',
  }),
]

const data = ref<TryOutRegistration[]>(props.registrations)
const sorting = ref<SortingState>([])
const globalFilter = ref('')

watch(
  () => props.registrations,
  val => (data.value = val),
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
  onSortingChange: updater => {
    sorting.value =
      typeof updater === 'function' ? updater(sorting.value) : updater
  },
  onGlobalFilterChange: val => {
    globalFilter.value = String(val)
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
})
</script>

<template>
  <div class="p-2 space-y-4">
    <input
      v-model="globalFilter"
      type="text"
      placeholder="Cari peserta..."
      class="w-full max-w-sm border rounded px-3 py-2 text-sm"
    />

    <div class="overflow-x-auto">
      <table class="min-w-full border-collapse border border-gray-300">

        <thead>
          <tr
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
          >
            <th
              v-for="header in headerGroup.headers"
              :key="header.id"
              :colSpan="header.colSpan"
              class="border bg-gray-100 px-3 py-2 text-left text-sm font-semibold cursor-pointer"
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
              class="border px-3 py-2 text-sm"
            >

              <div v-if="cell.column.id === 'paymentProofUrl'">
                <Image
                  v-if="cell.getValue()"
                  :src="cell.getValue() as string"
                  class="h-12 w-auto rounded object-cover"
                />
                <span v-else>-</span>
              </div>

              <div v-else-if="cell.column.id === 'paymentStatus'">
                <span
                  v-if="cell.getValue() === 'approved'"
                  class="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-700"
                >
                  Approved
                </span>

                <span
                  v-else-if="cell.getValue() === 'pending'"
                  class="px-2 py-1 text-xs font-semibold rounded bg-yellow-100 text-yellow-700"
                >
                  Pending
                </span>

                <span
                  v-else-if="cell.getValue() === 'rejected'"
                  class="px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-700"
                >
                  Rejected
                </span>

                <span v-else>-</span>
              </div>

              <div
                v-else-if="cell.column.id === 'actions'"
                class="flex gap-2"
              >
                <button
                  @click="emit('view', row.original.id)"
                  class="text-blue-600 hover:text-blue-800"
                  title="Detail"
                >
                  <Icon icon="mdi:eye-outline" width="20" />
                </button>

                <button
                  v-if="row.original.paymentStatus === 'pending'"
                  @click="emit('approve', row.original.id)"
                  class="text-green-600 hover:text-green-800"
                  title="Approve"
                >
                  <Icon icon="mdi:check-circle-outline" width="20" />
                </button>

                <button
                  v-if="row.original.paymentStatus === 'pending'"
                  @click="emit('reject', row.original.id)"
                  class="text-red-600 hover:text-red-800"
                  title="Reject"
                >
                  <Icon icon="mdi:close-circle-outline" width="20" />
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