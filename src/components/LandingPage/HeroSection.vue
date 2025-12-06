<script setup lang="ts">
import { Image } from '@unpic/vue'

const images = [
  { src: '/images/landingPage/envi_img/1.png',  position: 'absolute top-1/3 left-0 -translate-y-5' },
  { src: '/images/landingPage/envi_img/2.png',  position: 'absolute top-1/4 left-[8%] -translate-y-5' },
  { src: '/images/landingPage/envi_img/3.png',  position: 'absolute top-2/4 left-[16%] -translate-y-5' },
  { src: '/images/landingPage/envi_img/4.png',  position: 'absolute top-20 left-[15%] -translate-y-5' },
  { src: '/images/landingPage/envi_img/5.png',  position: 'absolute top-2/3 left-[8%] -translate-y-5' },
  { src: '/images/landingPage/envi_img/6.png',  position: 'absolute top-[45%] left-[5%] -translate-y-5' },

  { src: '/images/landingPage/envi_img/7.png',  position: 'absolute top-2/5 left-1/2 -translate-x-1/2 -translate-y-5' },

  { src: '/images/landingPage/envi_img/8.png',  position: 'absolute top-1/3 right-0 -translate-y-5' },
  { src: '/images/landingPage/envi_img/9.png',  position: 'absolute top-1/4 right-[8%] -translate-y-5' },
  { src: '/images/landingPage/envi_img/10.png', position: 'absolute top-2/4 right-[16%] -translate-y-5' },
  { src: '/images/landingPage/envi_img/11.png', position: 'absolute top-20 right-[15%] -translate-y-5' },
  { src: '/images/landingPage/envi_img/12.png', position: 'absolute top-2/3 right-[8%] -translate-y-5' },
  { src: '/images/landingPage/envi_img/13.png', position: 'absolute top-[45%] right-[5%] -translate-y-5' },
]
</script>

<template>
  <div class="w-full max-w-7xl mx-auto relative pt-14 ">
    <div class="relative">
      <Image src="/images/landingPage/curve_text_heading.png" alt="heading-hero" class="w-full max-w-md mx-auto" />
      <Image src="/images/landingPage/curve_text_sub_heading.png" alt="sub-heading-hero" class="w-full max-w-lg mx-auto" />
    </div>
    <div class="w-full max-w-xs mx-auto mb-24 hidden md:flex justify-center gap-4">
        <RouterLink to="/auth/login" class="flex-1 bg-primary text-center py-2 rounded-md text-white font-font-bold font-heading shadow-xl shadow-primary/20 hover:opacity-80 transition-all duration-200">Join Reduka</RouterLink>
        <RouterLink to="/auth/Register" class="flex-1 border-2 border-primary text-center py-2 rounded-md text-primary font-font-bold font-heading hover:bg-primary/10 transition-all duration-200">Mulai Perjalanan</RouterLink>
    </div> 
    <div class="relative w-fit mx-auto md:mt-0 mt-16">
      <div class="h-56 w-64 mx-auto rounded-full bg-primary shadow-2xl shadow-black/10"></div>
      <Image 
        src="/images/core/maskot.png" 
        alt="maskot-reduka" 
        class="w-96 h-auto absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-2/3 z-30"
      />
      <div class="size-6 absolute bottom-5 left-1/2 -translate-x-1/2 bg-amber-500 rounded-full"></div>
    </div>

    <div class="w-full max-w-xs mx-auto mt-10 md:hidden flex flex-col justify-center gap-4">
        <RouterLink to="/auth/login" class="flex-1 bg-primary text-center py-2 rounded-md text-white font-font-bold font-heading shadow-xl shadow-primary/20 hover:opacity-80 transition-all duration-200">Mulai Perjalanan</RouterLink>
        <RouterLink to="/auth/Register" class="flex-1 border-2 border-primary text-center py-2 rounded-md text-primary font-font-bold font-heading hover:bg-primary/10 transition-all duration-200">Bergabung Reduka</RouterLink>
    </div>

    <div v-for="(img, i) in images" :key="i" :class="img.position" >
         <Image :src="img.src" width="70" height="70" :class="[
  i % 4 === 0 ? 'animate-[float1_6s_ease-in-out_infinite]' : '',
  i % 4 === 1 ? 'animate-[float2_6s_ease-in-out_infinite]' : '',
  i % 4 === 2 ? 'animate-[float3_6s_ease-in-out_infinite]' : '',
  i % 4 === 3 ? 'animate-[float4_6s_ease-in-out_infinite]' : ''
]" :style="{ animationDelay: (i * 0.4) + 's' }" class="md:size-20 sm:size-16 size-10 shadow-2xl shadow-primary/20 rounded-full animate-[float_6s_ease-in-out_infinite]" :alt="'env'+i" /> 
    </div>
  </div>
</template>

<style>
@keyframes float {
  0% { transform: translateY(0) translateX(0); }
  25% { transform: translateY(-6px) translateX(4px); }
  50% { transform: translateY(4px) translateX(-4px); }
  75% { transform: translateY(-4px) translateX(3px); }
  100% { transform: translateY(0) translateX(0); }
}
@keyframes float1 { 0%{transform:translate(0,0);}25%{transform:translate(8px,-6px);}50%{transform:translate(-6px,4px);}75%{transform:translate(4px,6px);}100%{transform:translate(0,0);} }
@keyframes float2 { 0%{transform:translate(0,0);}25%{transform:translate(-10px,4px);}50%{transform:translate(6px,-6px);}75%{transform:translate(-4px,-8px);}100%{transform:translate(0,0);} }
@keyframes float3 { 0%{transform:translate(0,0);}25%{transform:translate(0,-10px);}50%{transform:translate(0,6px);}75%{transform:translate(0,-8px);}100%{transform:translate(0,0);} }
@keyframes float4 { 0%{transform:translate(0,0);}25%{transform:translate(10px,0);}50%{transform:translate(-8px,0);}75%{transform:translate(6px,0);}100%{transform:translate(0,0);} }
</style>
