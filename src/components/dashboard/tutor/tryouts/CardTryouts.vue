<script setup lang="ts">
import { Image } from "@unpic/vue"
import type { TryOut } from "../../../../types/entites/tryout"
import { useRouter } from "vue-router"
import { Icon } from '@iconify/vue'

defineProps<{
  data: TryOut
}>()

const router = useRouter()

const formatPrice = (price?: number) => {
  if (!price) return "Gratis"
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(price)
}

const handleView = (id: number) => {
  router.push({ name: 'tutor-tryouts-view', params: { id } })
}
</script>

<template>
  <div class="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer" @click="() => handleView(data.id)">
    
    <div class="relative overflow-hidden h-48 bg-gray-50 flex-shrink-0 border-b border-gray-100">
      <Image
        v-if="data.imageUrl"
        :src="data.imageUrl"
        :alt="`image tryout ${data.id}`"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div v-else class="w-full h-full flex flex-col items-center justify-center text-gray-400">
        <Icon icon="mdi:image-off-outline" class="text-4xl mb-2 opacity-50" />
        <span class="text-xs font-medium uppercase tracking-wider">No Image</span>
      </div>

      <!-- Tags overlay -->
      <div class="absolute top-3 right-3 flex flex-col gap-2 items-end">
        <span
          class="px-2 py-1 text-[11px] font-bold tracking-wider rounded border shadow-sm backdrop-blur-md"
          :class="data.isFree ? 'bg-green-500/90 text-white border-green-600' : 'bg-orange-500/90 text-white border-orange-600'"
        >
          {{ data.isFree ? 'FREE' : 'PAID' }}
        </span>
        <span
          class="px-2 py-1 text-[10px] font-bold tracking-wider uppercase rounded border shadow-sm backdrop-blur-md"
          :class="data.isPublished ? 'bg-blue-600/90 text-white border-blue-700' : 'bg-gray-600/90 text-white border-gray-700'"
        >
          {{ data.isPublished ? 'Published' : 'Draft' }}
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-5 flex flex-col grow">
      <h3 class="text-lg font-bold text-gray-800 line-clamp-2 leading-snug mb-2 group-hover:text-blue-600 transition-colors">
        {{ data.name }}
      </h3>
      
      <p class="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow leading-relaxed"
        v-html="data.description || 'Tidak ada deskripsi tersedia.'"
      />

      <!-- Footer action -->
      <div class="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
        <div class="flex flex-col">
           <span class="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">Harga</span>
           <span class="font-bold text-gray-800">{{ formatPrice(data.price) }}</span>
        </div>
        <div class="flex items-center gap-2">
          <RouterLink
            :to="{ name: 'admin-tryouts-leaderboard', params: { id: data.id } }"
            @click.stop
            class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-yellow-50 text-yellow-700 hover:bg-yellow-100 text-xs font-semibold transition-colors"
            title="Leaderboard"
          >
            <Icon icon="mdi:podium-gold" class="text-sm" />
            Leaderboard
          </RouterLink>
          <div class="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Icon icon="mdi:arrow-right" class="text-lg" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>