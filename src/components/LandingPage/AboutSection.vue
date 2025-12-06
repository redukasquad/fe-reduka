<script setup lang="ts">
import { Image } from '@unpic/vue';


</script>

<template>
<div class="w-full max-w-7xl mx-auto mt-10 relative">
    <div class="w-full max-w-md mx-auto h-[55vh] md:h-[80vh] xl:h-[50vh] bg-blue-700 relative ">
        <div class="absolute inset-0 z-0 bg-gray-200 rotate-6" />
        <div class="absolute inset-0 bg-gray-200 -rotate-6 z-10" />
        <div class="absolute inset-0 bg-gray-100 z-20 p-6 flex flex-col gap-6" >
           <div v-for="_, i in Array.from({ length:16 })" :key="i" class="w-full border-b-2 border-b-gray-400" />
           <div class="absolute inset-0 pt-6 px-8 text-justify backdrop-blur-[1px]">
                <h2 class="text-center">
                    <span class="block text-lg md:text-xl text-black">Apa Itu</span>
                    <span class="block font-bold text-primary text-2xl md:text-4xl">REDUKA</span>
                </h2>
                <p class=" leading-8 text-sm mt-2">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem, ea ipsum. Facere, nemo. Ab asperiores quod quis. Voluptate harum repellendus laboriosam quibusdam voluptatibus eum, aliquam animi voluptatum doloremque officiis tenetur.
                    Illo libero vitae asperiores fuga, voluptate odit numquam placeat impedit, veritatis necessitatibus doloremque sunt dolore esse sint ipsam rem minima expedita sed nihil nisi. Debitis pariatur officia aut! Autem, dignissimos?
                </p>
           </div>
        </div>
    </div>
    <Image src="/images/landingPage/about/pen.png" alt="pen-img" class="size-20 absolute top-1/2 left-1/5 -translate-y-1/2" />
    <Image src="/images/landingPage/about/globe.png" alt="globe-img" class="size-40 absolute bottom-10 right-10" />
    <Image src="/images/landingPage/about/formula_1.png" alt="formula_1-img" class="size-46 -rotate-70 absolute top-10 right-8 -translate-y-1/2" />
    <Image src="/images/landingPage/about/formula_2.png" alt="formula_2-img" class="size-32 absolute bottom-0 left-8 -translate-y-1/2" />
</div>
</template>