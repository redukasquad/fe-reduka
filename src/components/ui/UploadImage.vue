<script setup lang="ts">
import { ref, computed } from "vue"
import { deleteImage, deleteImageDB, uploadImage } from "../../services/uploads"
import { toast } from "vue3-toastify"

interface Props {
  modelValue?: string | null
}

const props = defineProps<Props>()
const emit = defineEmits(["update:modelValue"])

const preview = ref<string | null>(null)
const isUploading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const hasBennUpload = ref<string | null>(null)

const imageSrc = computed(() => preview.value ?? props.modelValue ?? undefined)

function openFilePicker() {
  fileInput.value?.click()
}

async function removeImage() {
  if (hasBennUpload.value) {
    const fileId = await deleteImageDB(hasBennUpload.value)
    preview.value = null
    emit("update:modelValue", null)
    if (fileId) {
      toast("success delete image", { type: "success" })
      await deleteImage(fileId)
      hasBennUpload.value = null
    }
  }
}

async function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  preview.value = URL.createObjectURL(file)

  try {
    isUploading.value = true

    if (hasBennUpload.value) {
      const fileId = await deleteImageDB(hasBennUpload.value)
      if (fileId) await deleteImage(fileId)
      hasBennUpload.value = null
    }

    const res = await uploadImage(file)

    if (res.url) hasBennUpload.value = res.url

    emit("update:modelValue", res.url ?? null)
  } catch (err) {
    console.error(err)
  } finally {
    isUploading.value = false
    if (fileInput.value) fileInput.value.value = ""
  }
}
</script>

<template>
  <div
    class="relative group w-56 h-56 border rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center"
  >
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="onFileChange"
    />

    <Image
      v-if="imageSrc"
      :src="imageSrc"
      class="w-full h-full object-cover"
      alt="preview"
    />

    <div
      v-else
      class="flex flex-col items-center text-gray-400 cursor-pointer"
      @click="openFilePicker"
    >
      <span class="text-sm">Upload Image</span>
    </div>

    <div
      v-if="isUploading"
      class="absolute inset-0 flex items-center justify-center bg-white/70"
    >
      <div
        class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
      />
    </div>

    <div
      v-if="imageSrc && !isUploading"
      class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    >
      <button
        type="button"
        @click.prevent="removeImage"
        class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-lg"
      >
        Remove
      </button>
    </div>
  </div>
</template>
