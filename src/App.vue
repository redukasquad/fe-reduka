<script setup lang="ts">
import Footer from './components/layout/Footer.vue'
import Header from './components/layout/Header.vue'
import BgBlock from './components/ui/bgBlock.vue'
</script>

<template>
  <div class="w-full min-h-screen relative overflow-hidden">
    <BgBlock />
    <Header />
    <RouterView v-slot="{ Component }">
      <transition name="page" mode="out-in" appear>
        <component :is="Component" />
      </transition>
    </RouterView>
    <Footer />
  </div>
</template>

<style scoped>
.page-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}
.page-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.page-enter-active {
  transition: all 320ms cubic-bezier(0.22, 1, 0.36, 1);
}

.page-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}
.page-leave-active {
  transition: all 260ms cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
