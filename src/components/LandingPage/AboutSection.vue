<script setup lang="ts">
import { Image } from '@unpic/vue';


</script>

<template>
<div class="w-full max-w-7xl mx-auto mt-10 relative">
    <div class="w-full max-w-md mx-auto h-[60vh] sm:h-[50vh] md:h-[45vh] lg:h-[80vh] xl:h-[65vh] bg-blue-700 relative ">
        <div class="absolute inset-0 z-0 bg-gray-200 rotate-6" />
        <div class="absolute inset-0 bg-gray-200 -rotate-6 z-10" />
        <div class="absolute inset-0 bg-gray-100 z-20 p-6 flex flex-col gap-6" >
           <div v-for="_, i in Array.from({ length:16 })" :key="i" class="w-full border-b-2 border-b-gray-400" />
           <div class="absolute inset-0 pt-3 md:pt-6 px-8 text-justify backdrop-blur-[1px]">
                <h2 class="text-center">
                    <span class="block text-lg md:text-xl text-black">Apa Itu</span>
                    <span class="block font-bold text-primary text-3xl md:text-4xl">REDUKA</span>
                </h2>
                <p class=" leading-8 text-xs md:text-sm md:mt-1 mt-0">
                    Reduka adalah platform pembelajaran inovatif yang berfokus membantu siswa yang mengalami putus sekolah agar dapat kembali melanjutkan pendidikan hingga ke jenjang perguruan tinggi. Melalui penyediaan materi pembelajaran, bimbingan, dan pendampingan yang terarah dan berkelanjutan, Reduka berupaya membuka kembali akses pendidikan serta menciptakan peluang masa depan yang lebih cerah bagi siswa yang sebelumnya terpinggirkan dari sistem pendidikan formal.
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