<script setup lang="ts">
import { useForm } from 'vee-validate';

const visible=defineModel<boolean>({
    default:false
})

const form=useForm()

const onSubmit=form.handleSubmit((values)=>{

})
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="New Question Choice"
    :style="{ width: '500px' }"
  >
    <form
      @submit.prevent="onSubmit"
    ></form>
  </Dialog>
</template>