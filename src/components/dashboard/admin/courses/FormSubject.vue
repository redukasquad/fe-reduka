<script setup lang="ts">
const visible = defineModel<boolean>({ default: false })
defineProps<{
    courseId?:string
}>()

</script>

<template>
<Dialog v-model:visible="visible" modal header="Create new Subject" :style="{ width: '60vw' }">
    <h1>hallo</h1>
</Dialog>
</template>