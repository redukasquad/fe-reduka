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
import { Image } from '@unpic/vue'
import type { TryOut } from '../../../../types/entites/tryout'
import { Icon } from '@iconify/vue'
import ColRegistered from './ColRegisteredTryouts.vue'

const props = defineProps<{
  tryouts: TryOut[]
  meta: {
    page: number
    perPage: number
    totalItems: number
    totalPages: number
  }
  q: string
}>()

const emit = defineEmits<{
  (e: 'view', id: number): void
  (e: 'update', id: number): void
  (e: 'delete', id: number): void
  (e: 'page-change', page: number): void
  (e: 'per-page-change', perPage: number): void
  (e: 'search', q: string): void
  (e: 'toggle-publish', id: number, value: boolean): void
}>()

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const columnHelper = createColumnHelper<TryOut>()

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
})

const columns = [
  columnHelper.display({
    id: 'no',
    header: 'No',
    cell: ({ row }) =>
      (props.meta.page - 1) * props.meta.perPage + row.index + 1,
  }),

  columnHelper.accessor('name', {
    header: 'Nama Tryout',
  }),

  columnHelper.accessor('imageUrl', {
    header: 'Poster',
  }),

  columnHelper.accessor('isFree', {
    header: 'Tipe',
    cell: info => (info.getValue() ? 'Gratis' : 'Berbayar'),
  }),

    columnHelper.accessor('price', {
        header: 'Harga',
        cell: info => {
            const { isFree, price } = info.row.original

            if (isFree) return '-'

            return currencyFormatter.format(Number(price ?? 0))
        },
    }),

    columnHelper.accessor('registrationStart', {
    header: 'Mulai',
    cell: info => {
        const value = info.getValue()
        if (!value) return '-'

        return dateFormatter.format(new Date(value as string))
    },
    }),

    columnHelper.accessor('registrationEnd', {
    header: 'Selesai',
    cell: info => {
        const value = info.getValue()
        if (!value) return '-'

        return dateFormatter.format(new Date(value as string))
    },
    }),

  columnHelper.accessor('isPublished', {
    header: 'Status',
  }),

 columnHelper.display({
    id: 'registration',
    header: 'Registrations',
  }),

  columnHelper.display({
    id: 'leaderboard',
    header: 'Leaderboard',
  }),

  columnHelper.display({
    id: 'actions',
    header: 'Aksi',
  }),
]

const data = ref<TryOut[]>(props.tryouts)
const sorting = ref<SortingState>([])
const globalFilter = ref(props.q)

watch(() => props.tryouts, v => (data.value = v), { deep: true })
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
    <div class="flex justify-between gap-4">
      <input
        v-model="globalFilter"
        type="text"
        placeholder="Cari tryout..."
        class="w-full sm:max-w-xs border rounded-md px-3 py-2 text-xs md:text-sm"
      />

      <RouterLink
        to="/dashboard/admin/tryouts/create"
        class="flex items-center justify-center gap-2 px-4 py-2 font-semibold rounded-md bg-primary text-primary-foreground"
      >
        <span class="text-xl sm:hidden">+</span>
        <span class="hidden sm:inline">Tryout Baru</span>
      </RouterLink>
    </div>
    <div v-if="tryouts.length > 0">
        <div class="overflow-x-auto">
        <table class="min-w-full border border-gray-300">
            <thead>
            <tr v-for="hg in table.getHeaderGroups()" :key="hg.id">
                <th
                v-for="h in hg.headers"
                :key="h.id"
                class="border px-3 py-2 bg-gray-100 text-xs md:text-sm text-nowrap" 
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
                class="border px-3 py-2 text-xs md:text-sm text-nowrap"
                >
                <div v-if="cell.column.id === 'imageUrl'">
                    <Image
                    v-if="cell.getValue()"
                    :src="cell.getValue() as string"
                    class="h-10 rounded"
                    />
                </div>
    
                <div v-else-if="cell.column.id === 'isPublished'">
                    <button
                    @click="
                        emit(
                        'toggle-publish',
                        row.original.id,
                        !row.original.isPublished
                        )
                    "
                    :class="
                        row.original.isPublished
                        ? 'bg-green-500'
                        : 'bg-gray-400'
                    "
                    class="text-white px-3 py-1 rounded text-xs"
                    >
                    {{
                        row.original.isPublished
                        ? 'Published'
                        : 'Unpublished'
                    }}
                    </button>
                </div>
    
                <div v-else-if="cell.column.id === 'actions'" class="flex gap-2">
                    <button
                        @click="emit('view', row.original.id)"
                        class="text-blue-600 hover:text-blue-800 transition"
                        title="Lihat"
                    >
                        <Icon icon="mdi:eye-outline" width="20" />
                    </button>
    
                    <button
                        @click="emit('update', row.original.id)"
                        class="text-yellow-600 hover:text-yellow-800 transition"
                        title="Edit"
                    >
                        <Icon icon="mdi:pencil-outline" width="20" />
                    </button>
                    <button
                        @click="emit('delete', row.original.id)"
                        class="text-red-600 hover:text-red-800 transition"
                        title="Hapus"
                    >
                        <Icon icon="mdi:delete-outline" width="20" />
                    </button>
                </div>
    
                <ColRegistered
                    v-else-if="cell.column.id === 'registration'"
                    :id="row.original.id"
                />

                <div v-else-if="cell.column.id === 'leaderboard'">
                    <RouterLink
                        :to="{ name: 'admin-tryouts-leaderboard', params: { id: row.original.id } }"
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-50 text-yellow-700 hover:bg-yellow-100 text-xs font-semibold transition-colors"
                        title="Lihat Leaderboard"
                    >
                        <Icon icon="mdi:podium-gold" width="14" />
                        Leaderboard
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
    
        <div class="flex items-center justify-between pt-2">
        <div class="flex items-center gap-2">
            <span class="text-xs md:text-sm">Rows:</span>
            <select
            :value="meta.perPage"
            @change="
                e =>
                emit(
                    'per-page-change',
                    Number((e.target as HTMLSelectElement).value)
                )
            "
            class="border rounded px-2 py-1 text-xs md:text-sm"
            >
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
            </select>
        </div>
    
        <div class="flex gap-1">
            <button
            :disabled="meta.page <= 1"
            @click="emit('page-change', meta.page - 1)"
            class="px-2 py-1 border rounded"
            >
            <Icon icon="heroicons:chevron-left" />
            </button>
    
            <button
            v-for="p in meta.totalPages"
            :key="p"
            @click="emit('page-change', p)"
            :class="p === meta.page ? 'bg-blue-600 text-white' : ''"
            class="px-3 py-1 border rounded"
            >
            {{ p }}
            </button>
    
            <button
            :disabled="meta.page >= meta.totalPages"
            @click="emit('page-change', meta.page + 1)"
            class="px-2 py-1 border rounded"
            >
            <Icon icon="heroicons:chevron-right" />
            </button>
        </div>
        </div>
    </div>
    <div class="mt-4" v-else>
        <p class="text-gray-600 text-center text-2xl font-medium">
            Tidak ada TryOut ditemukan
        </p>
        <p class="text-gray-400 text-center mt-2">
            TryOut akan muncul di sini ketika sudah tersedia.
        </p>
    </div>
  </div>
</template>