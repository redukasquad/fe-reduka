<script setup lang="ts">
import { ref, computed } from 'vue'

const modelValue = defineModel<string | null>()

const preview = ref<string | null>(null)
const isUploading = ref(false)
const isDragging = ref(false)

const imageSrc = computed(() => preview.value ?? modelValue.value ?? undefined)

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  preview.value = URL.createObjectURL(file)
  upload(file)
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
  isDragging.value = true
}

function onDragLeave() {
  isDragging.value = false
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false
  
  const file = e.dataTransfer?.files?.[0]
  if (!file || !file.type.startsWith('image/')) return

  preview.value = URL.createObjectURL(file)
  upload(file)
}

async function upload(file: File) {
  isUploading.value = true

  const formData = new FormData()
  formData.append('image', file)

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })

  const data = await res.json()
  modelValue.value = data.url ?? null

  isUploading.value = false
}

function removeImage() {
  preview.value = null
  modelValue.value = null
}
</script>

<template>
  <div class="w-full">
    <input
      type="file"
      accept="image/*"
      class="hidden"
      id="image"
      @change="onFileChange"
    />

    <label
      for="image"
      class="relative block w-full cursor-pointer overflow-hidden rounded-xl border-2 border-dashed transition-all duration-300"
      :class="[
        isDragging
          ? 'border-blue-500 bg-blue-50'
          : imageSrc
          ? 'border-gray-300 bg-white'
          : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-gray-100'
      ]"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <div v-if="imageSrc" class="relative group">
        <img
          :src="imageSrc"
          class="w-full h-64 object-cover"
          :class="{ 'opacity-50': isUploading }"
        />
        
        <div
          v-if="!isUploading"
          class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center"
        >
          <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-3">
            <button
              type="button"
              @click.prevent="removeImage"
              class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg"
            >
              Remove
            </button>
            <span class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-lg">
              Change
            </span>
          </div>
        </div>

        <div
          v-if="isUploading"
          class="absolute inset-0 flex items-center justify-center"
        >
          <div class="bg-white rounded-full p-4 shadow-xl">
            <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div v-else class="flex flex-col items-center justify-center h-64 px-6">
        <svg class="w-16 h-16 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        
        <p class="mb-2 text-lg font-semibold text-gray-700">
          <span class="text-blue-500">Click to upload</span> or drag and drop
        </p>
        <p class="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
      </div>
    </label>

    <div v-if="isUploading" class="mt-4">
      <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div class="bg-blue-500 h-full rounded-full animate-pulse" style="width: 100%"></div>
      </div>
      <p class="text-sm text-gray-600 mt-2 text-center">Uploading image...</p>
    </div>
  </div>
</template>