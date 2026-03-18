<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { useForm, useField } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import { useMutation } from "@tanstack/vue-query"
import { CreateTryoutQuestionSchema, type CreateTryoutQuestionInput } from "../../../../schemas/tryout.question"

import UploadImage from "../../../ui/UploadImage.vue"
import InputText from "primevue/inputtext"
import Dropdown from "primevue/dropdown"
import Button from "primevue/button"
import Editor from "primevue/editor"
import { TryOutQuestionService } from "../../../../services/tryout.question"
import { toast } from "vue3-toastify"

const props = defineProps<{
  tryoutId: number
  subtest: any[]
}>()

const visible = defineModel<boolean>({ default: false })

const selectedSubtest = ref<any | null>(null)

const form = useForm({
  validationSchema: toTypedSchema(CreateTryoutQuestionSchema),
  validateOnMount: true,
  initialValues: {
    difficultyLevel: "easy"
  }
})

const { value: questionText, errorMessage: questionTextError } =
  useField<string>("questionText")

const { value: imageUrl } =
  useField<string | null>("imageUrl")

const { value: difficultyLevel, errorMessage: difficultyLevelError } =
  useField<string>("difficultyLevel")

const { value: orderNumber } =
  useField<number>("orderNumber")

const { value: optionA, errorMessage: optionAError } =
  useField<string>("optionA")

const { value: optionB, errorMessage: optionBError } =
  useField<string>("optionB")

const { value: optionC, errorMessage: optionCError } =
  useField<string>("optionC")

const { value: optionD, errorMessage: optionDError } =
  useField<string>("optionD")

const { value: optionE, errorMessage: optionEError } =
  useField<string>("optionE")

const { value: correctOption, errorMessage: correctOptionError } =
  useField<string>("correctOption")

watch(selectedSubtest, (val) => {
  if (val) {
    orderNumber.value = val.currentQuestionCount + 1
  }
})

const difficultyOptions = [
  { label: "Easy", value: "easy" },
  { label: "Medium", value: "medium" },
  { label: "Hard", value: "hard" }
]

const correctOptions = [
  { label: "A", value: "A" },
  { label: "B", value: "B" },
  { label: "C", value: "C" },
  { label: "D", value: "D" },
  { label: "E", value: "E" }
]

const subtestOptions = computed(() =>
  props.subtest.map((s) => ({
    label: `${s.name} (${s.currentQuestionCount}/${s.questionCount})`,
    value: s
  }))
)

const mutation = useMutation({
  mutationFn: async (data: CreateTryoutQuestionInput) => {
    if (!selectedSubtest.value) {
      toast("Pilih subtest terlebih dahulu", { type: "error" })
      return
    }

    return await TryOutQuestionService.createQuestion(
      props.tryoutId,
      selectedSubtest.value.id,
      data
    )
  },
  onSuccess: () => {
    toast("Berhasil membuat soal", { type: "success" })
    form.resetForm()
    visible.value = false
  }
})

const onSubmit = form.handleSubmit((values: CreateTryoutQuestionInput) => {
  mutation.mutate(values)
})

const isDisabled = computed(
  () => !form.meta.value.valid || form.isSubmitting.value
)
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Tambah Soal Baru"
    :style="{ width: '900px' }"
  >
    <form @submit.prevent="onSubmit" class="flex flex-col gap-5 mt-3">

      <div>
        <Dropdown
          v-model="selectedSubtest"
          :options="subtestOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Pilih Subtest"
          class="w-full"
        />
      </div>

      <p class="text-sm text-gray-500">
        Opsional: gunakan jika soal membutuhkan gambar
      </p>

      <UploadImage v-model="imageUrl" />

      <div>
        <Editor
          v-model="questionText"
          placeholder="Tulis soal di sini"
          class="w-full h-[40vh]"
        />
        <small class="text-red-500">{{ questionTextError }}</small>
      </div>

      <div>
        <Dropdown
          v-model="difficultyLevel"
          :options="difficultyOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Tingkat Kesulitan"
          class="w-full"
        />
        <small class="text-red-500">{{ difficultyLevelError }}</small>
      </div>

      <div class="grid grid-cols-2 gap-4">

        <div>
          <InputText v-model="optionA" placeholder="Pilihan A" class="w-full" />
          <small class="text-red-500">{{ optionAError }}</small>
        </div>

        <div>
          <InputText v-model="optionB" placeholder="Pilihan B" class="w-full" />
          <small class="text-red-500">{{ optionBError }}</small>
        </div>

        <div>
          <InputText v-model="optionC" placeholder="Pilihan C" class="w-full" />
          <small class="text-red-500">{{ optionCError }}</small>
        </div>

        <div>
          <InputText v-model="optionD" placeholder="Pilihan D" class="w-full" />
          <small class="text-red-500">{{ optionDError }}</small>
        </div>

        <div>
          <InputText v-model="optionE" placeholder="Pilihan E" class="w-full" />
          <small class="text-red-500">{{ optionEError }}</small>
        </div>

      </div>

      <div>
        <Dropdown
          v-model="correctOption"
          :options="correctOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Jawaban Benar"
          class="w-full"
        />
        <small class="text-red-500">{{ correctOptionError }}</small>
      </div>

      <div class="flex justify-between items-center text-sm text-gray-500">
        <span v-if="selectedSubtest">
          Nomor soal otomatis: {{ orderNumber }}
        </span>
      </div>

      <div class="flex justify-end">
        <Button
          type="submit"
          label="Buat Soal"
          icon="pi pi-check"
          :loading="form.isSubmitting.value"
          :disabled="isDisabled"
        />
      </div>

    </form>
  </Dialog>
</template>