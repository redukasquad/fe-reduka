<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { useForm, useField } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import { useMutation, useQueryClient } from "@tanstack/vue-query"
import { CreateTryoutQuestionSchema, type CreateTryoutQuestionInput, type UpdateTryoutQuestionInput } from "../../../../schemas/tryout.question"
import type { TryOutQuestion } from "../../../../types/entites/tryout.question"

import UploadImage from "../../../ui/UploadImage.vue"
import InputText from "primevue/inputtext"
import InputNumber from "primevue/inputnumber"
import Dropdown from "primevue/dropdown"
import Button from "primevue/button"
import Editor from "primevue/editor"
import { TryOutQuestionService } from "../../../../services/tryout.question"
import { toast } from "vue3-toastify"

const props = defineProps<{
  tryoutId: number
  subtest: any[]
  initialData?: TryOutQuestion | null
  selectedSubtestId?: number
}>()

const visible = defineModel<boolean>({ default: false })
const queryClient = useQueryClient()
const selectedSubtestIdRef = ref<number | null>(null)

const selectedSubtest = computed(() => {
  if (!selectedSubtestIdRef.value) return null
  return props.subtest.find(s => s.id === selectedSubtestIdRef.value) || null
})

const isEditMode = computed(() => !!props.initialData)

const form = useForm({
  validationSchema: toTypedSchema(CreateTryoutQuestionSchema),
  validateOnMount: true,
  initialValues: {
    difficultyLevel: "easy",
    orderNumber: 1
  }
})

// fields
const { value: questionText, errorMessage: questionTextError } = useField<string>("questionText")
const { value: imageUrl } = useField<string | null>("imageUrl")
const { value: difficultyLevel, errorMessage: difficultyLevelError } = useField<string>("difficultyLevel")
const { value: orderNumber } = useField<number>("orderNumber")

const { value: optionA, errorMessage: optionAError } = useField<string>("optionA")
const { value: optionB, errorMessage: optionBError } = useField<string>("optionB")
const { value: optionC, errorMessage: optionCError } = useField<string>("optionC")
const { value: optionD, errorMessage: optionDError } = useField<string>("optionD")
const { value: optionE, errorMessage: optionEError } = useField<string>("optionE")
const { value: correctOption, errorMessage: correctOptionError } = useField<string>("correctOption")

// option types
const optionTypes = ref({
  A: 'text',
  B: 'text',
  C: 'text',
  D: 'text',
  E: 'text',
})

// helper
const parseOptionValue = (val: string, key: 'A'|'B'|'C'|'D'|'E') => {
  if (val && val.startsWith('IMG::')) {
    optionTypes.value[key] = 'image'
    return val.substring(5)
  }
  optionTypes.value[key] = 'text'
  return val
}

const formatOptionValue = (val: string, key: 'A'|'B'|'C'|'D'|'E') => {
  if (optionTypes.value[key] === 'image' && val) {
    return val.startsWith('IMG::') ? val : `IMG::${val}`
  }
  return val
}

// Watcher 1: fire ONLY when dialog opens or edit data changes
// Does NOT watch props.subtest to avoid double-firing (props.subtest is read at call time, always fresh)
watch(
  [() => props.initialData, visible],
  ([data, isVisible]) => {
    if (!isVisible) return

    if (data) {
      // EDIT MODE
      selectedSubtestIdRef.value = data.subtestId
      optionTypes.value = { A: 'text', B: 'text', C: 'text', D: 'text', E: 'text' }
      form.setValues({
        questionText: data.questionText,
        imageUrl: data.imageUrl || "",
        difficultyLevel: data.difficultyLevel,
        orderNumber: data.orderNumber,
        optionA: parseOptionValue(data.optionA, 'A'),
        optionB: parseOptionValue(data.optionB, 'B'),
        optionC: parseOptionValue(data.optionC, 'C'),
        optionD: parseOptionValue(data.optionD, 'D'),
        optionE: parseOptionValue(data.optionE, 'E'),
        correctOption: data.correctOption
      })
    } else {
      // CREATE MODE — read props.subtest directly at call-time (not via dependency)
      optionTypes.value = { A: 'text', B: 'text', C: 'text', D: 'text', E: 'text' }

      const targetSubId =
        props.selectedSubtestId ||
        selectedSubtestIdRef.value ||
        props.subtest?.[0]?.id ||
        null

      selectedSubtestIdRef.value = targetSubId

      // Read currentQuestionCount directly from subtest, showing in the label too
      const sub = props.subtest.find((s: any) => s.id === targetSubId)
      console.log('[FormCreateQuestion] subtest for order:', sub, 'currentQuestionCount:', sub?.currentQuestionCount)

      const nextOrderNumber = (sub?.currentQuestionCount ?? 0) + 1

      form.resetForm({
        values: {
          questionText: '',
          imageUrl: '',
          difficultyLevel: 'easy',
          orderNumber: nextOrderNumber,
          optionA: '',
          optionB: '',
          optionC: '',
          optionD: '',
          optionE: '',
          correctOption: undefined,
        }
      })
    }
  },
  { immediate: true }
)

// Watcher 2: when user selects a different subtest in the dropdown, update orderNumber
watch(selectedSubtest, (sub) => {
  if (visible.value && !isEditMode.value && sub) {
    const count = sub.currentQuestionCount ?? 0
    form.setFieldValue('orderNumber', count + 1)
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
    value: s.id
  }))
)

const mutation = useMutation({
  mutationFn: async (data: CreateTryoutQuestionInput | UpdateTryoutQuestionInput) => {
    if (!selectedSubtest.value) {
      toast("Pilih subtest terlebih dahulu", { type: "error" })
      throw new Error("Pilih subtest")
    }

    const formattedData = {
      ...data,
      optionA: formatOptionValue(data.optionA as string, 'A'),
      optionB: formatOptionValue(data.optionB as string, 'B'),
      optionC: formatOptionValue(data.optionC as string, 'C'),
      optionD: formatOptionValue(data.optionD as string, 'D'),
      optionE: formatOptionValue(data.optionE as string, 'E'),
    }

    if (isEditMode.value && props.initialData) {
      return await TryOutQuestionService.updateQuestion(props.initialData.id, formattedData)
    } else {
      return await TryOutQuestionService.createQuestion(
        props.tryoutId,
        selectedSubtest.value.id,
        formattedData as CreateTryoutQuestionInput
      )
    }
  },
  onSuccess: () => {
    toast(isEditMode.value ? "Berhasil mengubah soal" : "Berhasil membuat soal", { type: "success" })
    queryClient.invalidateQueries({ queryKey: ['tryout-questions'] })
    queryClient.invalidateQueries({ queryKey: ['subtest-count-question'] })
    visible.value = false
  },
  onError: () => {
    toast("Terjadi kesalahan", { type: "error" })
  }
})

const onSubmit = form.handleSubmit((values: CreateTryoutQuestionInput) => {
  mutation.mutate(values)
})

const isDisabled = computed(
  () => !form.meta.value.valid || form.isSubmitting.value || mutation.isPending.value
)

const toggleOptionType = (key: 'A'|'B'|'C'|'D'|'E') => {
  optionTypes.value[key] = optionTypes.value[key] === 'text' ? 'image' : 'text'

  if (key === 'A') optionA.value = ''
  if (key === 'B') optionB.value = ''
  if (key === 'C') optionC.value = ''
  if (key === 'D') optionD.value = ''
  if (key === 'E') optionE.value = ''
}
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="isEditMode ? 'Edit Soal' : 'Tambah Soal Baru'"
    :style="{ width: '900px' }"
  >
    <form @submit.prevent="onSubmit" class="flex flex-col gap-5 mt-3">

      <div>
        <Dropdown
          v-model="selectedSubtestIdRef"
          :options="subtestOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Pilih Subtest"
          class="w-full"
          :disabled="isEditMode"
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

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div class="flex flex-col gap-1 border p-3 rounded">
          <div class="flex justify-between items-center mb-1">
            <span class="font-semibold text-sm">Pilihan A</span>
            <Button variant="text" size="small" class="p-0 h-auto text-xs text-blue-600" @click="toggleOptionType('A')" type="button">
              <Icon :icon="optionTypes.A === 'text' ? 'mdi:image' : 'mdi:format-text'" class="mr-1" />
              {{ optionTypes.A === 'text' ? 'Ganti ke Gambar' : 'Ganti ke Teks' }}
            </Button>
          </div>
          <InputText v-if="optionTypes.A === 'text'" v-model="optionA" placeholder="Masukkan Pilihan A" class="w-full" />
          <UploadImage v-else v-model="optionA" />
          <small class="text-red-500">{{ optionAError }}</small>
        </div>

        <div class="flex flex-col gap-1 border p-3 rounded">
          <div class="flex justify-between items-center mb-1">
            <span class="font-semibold text-sm">Pilihan B</span>
            <Button variant="text" size="small" class="p-0 h-auto text-xs text-blue-600" @click="toggleOptionType('B')" type="button">
              <Icon :icon="optionTypes.B === 'text' ? 'mdi:image' : 'mdi:format-text'" class="mr-1" />
              {{ optionTypes.B === 'text' ? 'Ganti ke Gambar' : 'Ganti ke Teks' }}
            </Button>
          </div>
          <InputText v-if="optionTypes.B === 'text'" v-model="optionB" placeholder="Masukkan Pilihan B" class="w-full" />
          <UploadImage v-else v-model="optionB" />
          <small class="text-red-500">{{ optionBError }}</small>
        </div>

        <div class="flex flex-col gap-1 border p-3 rounded">
          <div class="flex justify-between items-center mb-1">
            <span class="font-semibold text-sm">Pilihan C</span>
            <Button variant="text" size="small" class="p-0 h-auto text-xs text-blue-600" @click="toggleOptionType('C')" type="button">
              <Icon :icon="optionTypes.C === 'text' ? 'mdi:image' : 'mdi:format-text'" class="mr-1" />
              {{ optionTypes.C === 'text' ? 'Ganti ke Gambar' : 'Ganti ke Teks' }}
            </Button>
          </div>
          <InputText v-if="optionTypes.C === 'text'" v-model="optionC" placeholder="Masukkan Pilihan C" class="w-full" />
          <UploadImage v-else v-model="optionC" />
          <small class="text-red-500">{{ optionCError }}</small>
        </div>

        <div class="flex flex-col gap-1 border p-3 rounded">
          <div class="flex justify-between items-center mb-1">
            <span class="font-semibold text-sm">Pilihan D</span>
            <Button variant="text" size="small" class="p-0 h-auto text-xs text-blue-600" @click="toggleOptionType('D')" type="button">
              <Icon :icon="optionTypes.D === 'text' ? 'mdi:image' : 'mdi:format-text'" class="mr-1" />
              {{ optionTypes.D === 'text' ? 'Ganti ke Gambar' : 'Ganti ke Teks' }}
            </Button>
          </div>
          <InputText v-if="optionTypes.D === 'text'" v-model="optionD" placeholder="Masukkan Pilihan D" class="w-full" />
          <UploadImage v-else v-model="optionD" />
          <small class="text-red-500">{{ optionDError }}</small>
        </div>

        <div class="flex flex-col gap-1 border p-3 rounded md:col-span-2">
          <div class="flex justify-between items-center mb-1">
            <span class="font-semibold text-sm">Pilihan E</span>
            <Button variant="text" size="small" class="p-0 h-auto text-xs text-blue-600" @click="toggleOptionType('E')" type="button">
              <Icon :icon="optionTypes.E === 'text' ? 'mdi:image' : 'mdi:format-text'" class="mr-1" />
              {{ optionTypes.E === 'text' ? 'Ganti ke Gambar' : 'Ganti ke Teks' }}
            </Button>
          </div>
          <InputText v-if="optionTypes.E === 'text'" v-model="optionE" placeholder="Masukkan Pilihan E" class="w-full" />
          <UploadImage v-else v-model="optionE" />
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

      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-gray-700">Nomor Soal</label>
        <InputNumber
          v-model="orderNumber"
          :min="1"
          placeholder="Masukkan nomor soal"
          class="w-full"
          showButtons
          buttonLayout="horizontal"
          :step="1"
        />
        <small class="text-gray-400">Nomor urut soal dalam subtest ini</small>
      </div>

      <div class="flex justify-end">
        <Button
          type="submit"
          :label="isEditMode ? 'Simpan Perubahan' : 'Buat Soal'"
          icon="pi pi-check"
          :loading="form.isSubmitting.value || mutation.isPending.value"
          :disabled="isDisabled"
        />
      </div>

    </form>
  </Dialog>
</template>