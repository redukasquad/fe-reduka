<script setup lang="ts">
import { Image } from "@unpic/vue"
import type { TryOut } from "../../../../types/entites/tryout"
import { useRouter } from "vue-router";

const props = defineProps<{
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
  <Card class="overflow-hidden">
    
    <template #header>
      <Image
        v-if="data.imageUrl"
        :src="data.imageUrl"
        :alt="`image tryout ${data.id}`"
        class="w-full h-48 object-cover"
      />
      <div
        v-else
        class="w-full h-48 flex items-center justify-center bg-gray-100 text-gray-400"
      >
        No Image
      </div>
    </template>

    <template #title>
      <div class="flex justify-between items-start gap-2">
        <span class="font-semibold">
          {{ data.name }}
        </span>

        <Tag
          :value="data.isFree ? 'FREE' : 'PAID'"
          :severity="data.isFree ? 'success' : 'warning'"
        />
      </div>
    </template>

    <template #content>
      <p class="text-sm text-gray-600 line-clamp-3">
        {{ data.description || "Tidak ada deskripsi." }}
      </p>

      <div class="mt-3 flex justify-between items-center">
        <span class="font-semibold">
          {{ formatPrice(data.price) }}
        </span>

        <Button
          label="Detail"
          size="small"
          icon="pi pi-arrow-right"
          text
          @click="()=>handleView(data.id)"
        />
      </div>
    </template>

  </Card>
</template>