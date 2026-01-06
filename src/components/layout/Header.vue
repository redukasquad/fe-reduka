<script setup lang="ts">
import { Image } from '@unpic/vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useAuth } from '../../stores/auth'
import { useRoute } from 'vue-router'
import { headerMenu } from '../../constants'
import { Icon } from '@iconify/vue'

const auth = useAuth()

const isLogin = computed(() => !!auth.token)
const user = computed(() => auth.user)

const dashboardRoute = computed(() => {
  if (!user.value) return '/'

  switch (user.value.role) {
    case 'ADMIN':
      return '/dashboard/admin'
    case 'TUTOR':
      return '/dashboard/tutor'
    case 'STUDENT':
      return '/dashboard/user'
    default:
      return '/'
  }
})

const router = useRoute()

const showHeader = computed(() => {
  const path = router.path
  return !path.startsWith('/dashboard/admin') &&
         !path.startsWith('/dashboard/tutor')
})

const isScrolling = ref(false)
const isMobileMenuOpen = ref(false)

const handleScroll = () => {
  isScrolling.value = window.scrollY > 50
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const isMobileRegisterLight = computed(() => {
  return !isScrolling.value || isMobileMenuOpen.value
})

</script>

<template>
  <header
    v-if="showHeader"
    :class="[
      'w-full fixed top-0 left-0 px-[8%] z-50 transition-all duration-300',
      isScrolling
        ? 'bg-primary/95 shadow-md backdrop-blur py-2 text-primary-foreground'
        : 'py-3 text-primary'
    ]"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <RouterLink to="/" class="flex gap-2 items-center">
          <Image src="/images/core/logo.png" alt="logo-reduka" class="w-10 h-auto" />
          <h1 class="font-semibold text-primary-foreground text-xl">REDUKA</h1>
        </RouterLink>
      </div>

      <div class="hidden lg:flex gap-4 justify-center">
        <RouterLink
          v-for="menu in headerMenu"
          :key="menu.id"
          :to="menu.path"
          :class="[
            'font-medium flex items-center gap-2 active:scale-95 active:shadow lg:text-xs xl:text-sm font-heading px-4 py-2 rounded-md underline-offset-4 transition-all duration-200',
            router.path.startsWith(menu.path)
              ? 'bg-blue-200 text-primary font-semibold'
              : 'hover:bg-blue-200 hover:text-primary hover:font-semibold'
          ]"
        >
          <Icon :icon="menu.icon" class="text-xl" />
          {{ menu.name }}
        </RouterLink>
      </div>

      <div class="hidden lg:flex justify-end">
        <nav>
          <div v-if="!isLogin" class="flex gap-2 items-center">
            <RouterLink
              to="/auth/login"
              class="px-4 py-2 rounded-sm text-sm text-primary-foreground font-semibold bg-[#1B6644] hover:bg-[#1B6644]/80 transition-all duration-200"
            >
              Login
            </RouterLink>
            <RouterLink
              to="/auth/register"
              :class="['px-4 py-2 rounded-sm text-sm font-semibold transition-all duration-200', !isScrolling?'text-primary ring ring-primary bg-primary/10 hover:bg-primary/20':'text-primary-foreground ring ring-primary-foreground hover:bg-white/5']"
            >
              Register
            </RouterLink>
          </div>

          <RouterLink
            v-else
            :to="dashboardRoute"
            class="hover:scale-105 transition-all duration-200 flex flex-col justify-center items-center"
          >
            <img
              :src="user?.profileImage || '/profile.jpg'"
              class="size-9 rounded-full shadow-md"
              loading="lazy"
            />
            <p class="text-xs text-center">
              {{ user?.username || 'User' }}
            </p>
          </RouterLink>
        </nav>
      </div>

      <button
        @click="toggleMobileMenu"
        class="lg:hidden flex flex-col justify-center items-center w-10 h-10 relative z-50"
        aria-label="Toggle menu"
      >
        <span
          :class="[
            'block w-6 h-0.5 transition-all duration-300',
            isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : '',
            isScrolling ? 'bg-primary-foreground' : isMobileMenuOpen?'bg-primary-foreground':'bg-primary'
          ]"
        ></span>

        <span
          :class="[
            'block w-6 h-0.5 my-1.5 transition-all duration-300',
            isMobileMenuOpen ? 'opacity-0' : '',
            isScrolling ? 'bg-primary-foreground' : isMobileMenuOpen?'bg-primary-foreground':'bg-primary'
          ]"
        ></span>

        <span
          :class="[
            'block w-6 h-0.5 transition-all duration-300',
            isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : '',
            isScrolling ? 'bg-primary-foreground' : isMobileMenuOpen?'bg-primary-foreground':'bg-primary'
          ]"
        ></span>
      </button>
    </div>

    <div
      :class="[
        'fixed top-0 right-0 h-screen w-full bg-primary/95 backdrop-blur transition-transform duration-300 lg:hidden',
        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      ]"
    >
      <div class="flex flex-col items-center justify-center h-full gap-6 px-8">
        <RouterLink
          v-for="menu in headerMenu"
          :key="menu.id"
          :to="menu.path"
          @click="closeMobileMenu"
          :class="[
            'font-medium text-lg flex items-center gap-2 font-heading px-6 py-3 rounded-md w-full text-center transition-all duration-200',
            router.path.startsWith(menu.path)
              ? 'bg-blue-200 text-primary font-semibold'
              : 'hover:bg-blue-200 hover:text-primary hover:font-semibold text-primary-foreground'
          ]"
        >
          <Icon :icon="menu.icon" class="text-xl" />
          {{ menu.name }}
        </RouterLink>

        <div class="border-t border-primary-foreground/20 w-full my-4"></div>

        <div v-if="!isLogin" class="flex flex-col gap-3 w-full">
          <RouterLink
            to="/auth/login"
            @click="closeMobileMenu"
            class="px-6 py-3 rounded-sm text-base text-primary-foreground font-semibold bg-[#1B6644] hover:bg-[#1B6644]/80 transition-all duration-200 text-center"
          >
            Login
          </RouterLink>
          <RouterLink
              to="/auth/register"
              @click="closeMobileMenu"
              :class="[
                'px-6 py-3 rounded-sm text-base font-semibold transition-all duration-200 text-center',
                isMobileRegisterLight
                  ? 'text-primary ring-2 ring-primary/40 hover:bg-primary/5'
                  : 'text-primary-foreground ring ring-primary-foreground hover:bg-white/5'
              ]"
            >
              Register
            </RouterLink>

        </div>

        <RouterLink
          v-else
          :to="dashboardRoute"
          @click="closeMobileMenu"
          class="hover:scale-105 transition-all duration-200 flex flex-col justify-center items-center gap-2"
        >
          <Image
            :src="user?.profileImage || '/profile.jpg'"
            class="size-16 rounded-full shadow-md"
            loading="lazy"
          />
          <p class="text-sm text-center text-primary-foreground font-medium">
            {{ user?.username || 'User' }}
          </p>
        </RouterLink>
      </div>
    </div>
  </header>
</template>