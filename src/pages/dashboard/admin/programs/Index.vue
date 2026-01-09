<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { ProgramService } from '../../../../services/prorgram';


const { data, isLoading, isError }=useQuery({
    queryKey:['programs'],
    queryFn:ProgramService.findAll
})

console.log(data)
</script>

<template>
<div class=" h-screen bg-blue-800">
    hallo
</div>
</template>