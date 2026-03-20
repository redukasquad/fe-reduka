<script setup lang="ts">
import { Image } from '@unpic/vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useAuth } from '../../stores/auth'
import { useRoute, useRouter } from 'vue-router'
import { headerMenu } from '../../constants'
import { Icon } from '@iconify/vue'

const auth = useAuth()
const isLogin = computed(() => !!auth.token)
const user = computed(() => auth.user)

const dashboardRoute = computed(() => {
  if (!user.value) return '/'
  switch (user.value.role) {
    case 'ADMIN': return '/dashboard/admin'
    case 'TUTOR': return '/dashboard/tutor'
    case 'STUDENT': return '/dashboard/user'
    default: return '/'
  }
})

const route = useRoute()
const router = useRouter()

const showHeader = computed(() => {
  const path = route.path
  return !path.startsWith('/dashboard/admin') && !path.startsWith('/dashboard/tutor')
})

const scrolled = ref(false)
const mobileOpen = ref(false)
const profileOpen = ref(false)

const onScroll = () => { scrolled.value = window.scrollY > 40 }
onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

function logout() {
  auth.logout()
  router.push('/auth/login')
  profileOpen.value = false
  mobileOpen.value = false
}

function closeAll() {
  mobileOpen.value = false
  profileOpen.value = false
}
</script>

<template>
  <header v-if="showHeader" class="fixed top-0 left-0 w-full z-50 flex justify-center px-4 pt-3">
    <!-- Floating pill navbar -->
    <nav
      :class="[
        'w-full max-w-[95%] transition-all duration-500 rounded-2xl',
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/60 py-2.5 px-5'
          : 'bg-primary/95 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.18)] border border-white/10 py-3 px-6'
      ]"
    >
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2.5 shrink-0" @click="closeAll">
          <div :class="['w-8 h-8 rounded-xl flex items-center justify-center shadow-inner', scrolled ? 'bg-primary/10' : 'bg-white/15']">
            <Image src="/images/core/logo.png" alt="REDUKA" class="w-5 h-5 object-contain" />
          </div>
          <span :class="['font-extrabold text-base tracking-tight', scrolled ? 'text-primary' : 'text-white']">
            REDUKA
          </span>
        </RouterLink>

        <!-- Desktop nav links -->
        <div class="hidden lg:flex items-center gap-1">
          <RouterLink
            v-for="menu in headerMenu"
            :key="menu.id"
            :to="menu.path"
            :class="[
              'relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
              route.path.startsWith(menu.path)
                ? scrolled
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white/20 text-white font-semibold'
                : scrolled
                  ? 'text-gray-600 hover:bg-gray-100 hover:text-primary'
                  : 'text-white/80 hover:bg-white/15 hover:text-white'
            ]"
          >
            <Icon :icon="menu.icon" class="text-base" />
            {{ menu.name }}
            <!-- Active dot -->
            <span
              v-if="route.path.startsWith(menu.path)"
              :class="['absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full', scrolled ? 'bg-primary' : 'bg-white']"
            />
          </RouterLink>
        </div>

        <!-- Desktop auth -->
        <div class="hidden lg:flex items-center gap-2">
          <template v-if="!isLogin">
            <RouterLink
              to="/auth/login"
              :class="['px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200', scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white/80 hover:bg-white/15 hover:text-white']"
            >
              Masuk
            </RouterLink>
            <RouterLink
              to="/auth/register"
              :class="['px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm', scrolled ? 'bg-primary text-white hover:bg-primary/90' : 'bg-white text-primary hover:bg-white/90']"
            >
              Daftar
            </RouterLink>
          </template>

          <template v-else>
            <div class="relative">
              <button
                @click="profileOpen = !profileOpen"
                :class="['flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200', scrolled ? 'hover:bg-gray-100' : 'hover:bg-white/15']"
              >
                <img
                  :src="user?.profileImage || '/profile.jpg'"
                  class="w-7 h-7 rounded-full object-cover ring-2 ring-white/40"
                />
                <span :class="['text-sm font-medium max-w-[100px] truncate', scrolled ? 'text-gray-700' : 'text-white']">
                  {{ user?.username }}
                </span>
                <Icon icon="mdi:chevron-down" :class="['text-sm transition-transform duration-200', profileOpen ? 'rotate-180' : '', scrolled ? 'text-gray-400' : 'text-white/60']" />
              </button>

              <Transition enter-from-class="opacity-0 scale-95 -translate-y-1" enter-active-class="transition-all duration-150" leave-to-class="opacity-0 scale-95 -translate-y-1" leave-active-class="transition-all duration-150">
                <div v-if="profileOpen" class="absolute right-0 top-full mt-2 w-44 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  <RouterLink :to="dashboardRoute" @click="profileOpen = false" class="flex items-center gap-2.5 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <Icon icon="mdi:view-dashboard-outline" class="text-primary" />
                    Dashboard
                  </RouterLink>
                  <div class="border-t border-gray-100" />
                  <button @click="logout" class="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors">
                    <Icon icon="mdi:logout" />
                    Keluar
                  </button>
                </div>
              </Transition>
            </div>
          </template>
        </div>

        <!-- Mobile hamburger -->
        <button
          @click="mobileOpen = !mobileOpen"
          :class="['lg:hidden w-9 h-9 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all duration-200', scrolled ? 'hover:bg-gray-100' : 'hover:bg-white/15']"
        >
          <span :class="['block h-0.5 w-5 rounded-full transition-all duration-300', mobileOpen ? 'rotate-45 translate-y-2' : '', scrolled ? 'bg-gray-700' : 'bg-white']" />
          <span :class="['block h-0.5 w-5 rounded-full transition-all duration-300', mobileOpen ? 'opacity-0' : '', scrolled ? 'bg-gray-700' : 'bg-white']" />
          <span :class="['block h-0.5 w-5 rounded-full transition-all duration-300', mobileOpen ? '-rotate-45 -translate-y-2' : '', scrolled ? 'bg-gray-700' : 'bg-white']" />
        </button>
      </div>
    </nav>

    <!-- Mobile menu — full screen overlay -->
    <Transition enter-from-class="opacity-0" enter-active-class="transition-opacity duration-200" leave-to-class="opacity-0" leave-active-class="transition-opacity duration-200">
      <div v-if="mobileOpen" class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" @click="mobileOpen = false" />
    </Transition>

    <Transition enter-from-class="translate-x-full" enter-active-class="transition-transform duration-300" leave-to-class="translate-x-full" leave-active-class="transition-transform duration-300">
      <div v-if="mobileOpen" class="fixed top-0 right-0 h-full w-72 z-50 bg-white shadow-2xl lg:hidden flex flex-col">
        <!-- Mobile header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Image src="/images/core/logo.png" alt="REDUKA" class="w-4 h-4 object-contain" />
            </div>
            <span class="font-extrabold text-primary">REDUKA</span>
          </div>
          <button @click="mobileOpen = false" class="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400">
            <Icon icon="mdi:close" />
          </button>
        </div>

        <!-- Mobile nav links -->
        <nav class="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
          <RouterLink
            v-for="menu in headerMenu"
            :key="menu.id"
            :to="menu.path"
            @click="mobileOpen = false"
            :class="[
              'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
              route.path.startsWith(menu.path)
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
            ]"
          >
            <Icon :icon="menu.icon" class="text-lg" />
            {{ menu.name }}
          </RouterLink>
        </nav>

        <!-- Mobile auth -->
        <div class="px-4 py-5 border-t border-gray-100 space-y-2">
          <template v-if="!isLogin">
            <RouterLink to="/auth/login" @click="mobileOpen = false"
              class="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors">
              Masuk
            </RouterLink>
            <RouterLink to="/auth/register" @click="mobileOpen = false"
              class="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-colors">
              Daftar Sekarang
            </RouterLink>
          </template>
          <template v-else>
            <div class="flex items-center gap-3 px-3 py-2 rounded-xl bg-gray-50 mb-3">
              <img :src="user?.profileImage || '/profile.jpg'" class="w-9 h-9 rounded-full object-cover" />
              <div class="min-w-0">
                <p class="text-sm font-semibold text-gray-800 truncate">{{ user?.username }}</p>
                <p class="text-xs text-gray-400 truncate">{{ user?.email }}</p>
              </div>
            </div>
            <RouterLink :to="dashboardRoute" @click="mobileOpen = false"
              class="flex items-center gap-2 w-full py-3 px-4 rounded-xl text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors">
              <Icon icon="mdi:view-dashboard-outline" class="text-primary" />
              Dashboard
            </RouterLink>
            <button @click="logout"
              class="flex items-center gap-2 w-full py-3 px-4 rounded-xl text-sm font-semibold text-red-500 border border-red-100 hover:bg-red-50 transition-colors">
              <Icon icon="mdi:logout" />
              Keluar
            </button>
          </template>
        </div>
      </div>
    </Transition>
  </header>
</template>
