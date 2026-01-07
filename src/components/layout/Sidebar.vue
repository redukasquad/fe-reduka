<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { adminMenu } from '../../constants'
import { Icon } from '@iconify/vue'
import { useAuth } from '../../stores/auth'

const route = useRoute()
const router=useRouter()

const auth = useAuth()

const user = computed(() => auth.user)
const isExpanded = ref(true)

const showSidebar = computed(() => {
  const path = route.path
  return path.startsWith('/dashboard/admin') ||
         path.startsWith('/dashboard/tutor')
})

const toggleSidebar = () => {
  isExpanded.value = !isExpanded.value
}

const handleLogout = () => {
  auth.logout()
  router.push('/auth/login')
}


const isActiveMenu = (menuPath: string): boolean => {
  const currentPath = route.path

  if (currentPath === menuPath) return true

  if (
    currentPath.startsWith(menuPath + '/') && 
    menuPath !== '/dashboard/admin'
  ) {
    return true
  }

  if (currentPath === '/dashboard/admin' && menuPath === '/dashboard/admin') {
    return true
  }

  return false
}


</script>

<template>
  <aside 
    v-if="showSidebar" 
    :class="[
      'fixed top-0 left-0 h-screen bg-primary text-primary-foreground transition-all duration-300 z-40 flex flex-col',
      isExpanded ? 'w-64' : 'w-20'
    ]"
  >
    <div class="flex flex-col h-full relative">
      <div class="p-4 flex items-center justify-between border-b border-primary-foreground/10">
        <div v-if="isExpanded" class="flex items-center gap-3">
          <img
            :src="user?.profileImage || '/profile.jpg'"
            class="size-10 rounded-full shadow-md"
            loading="lazy"
          />
          <div class="flex flex-col">
            <p class="text-sm font-semibold">{{ user?.username || 'User' }}</p>
            <p class="text-xs opacity-70">{{ user?.role || 'Admin' }}</p>
          </div>
        </div>
        <img
          v-else
          :src="user?.profileImage || '/profile.jpg'"
          class="size-10 rounded-full shadow-md mx-auto"
          loading="lazy"
        />
      </div>

      <button
        @click="toggleSidebar"
        :class="['m-4 p-1 cursor-pointer active:scale-95 w-fit ml-auto rounded-md bg-secondary text-primary absolute top-8 transition-all duration-200 flex items-center justify-center', isExpanded?'left-[90%]':'left-[80%]']"
      >
        <Icon 
          :icon="isExpanded ? 'mdi:chevron-left' : 'mdi:chevron-right'" 
          class="text-2xl"
        />
      </button>

      <nav class="flex-1 px-3 py-4 overflow-y-auto">
        <RouterLink
          v-for="menu in adminMenu"
          :key="menu.id"
          :to="menu.path"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 mb-2',
            isActiveMenu(menu.path)
              ? 'bg-primary-foreground text-primary font-semibold'
              : 'hover:bg-primary-foreground/10'
          ]"
        >
          <Icon :icon="menu.icon" class="text-xl shrink-0" />
          <span 
            v-if="isExpanded" 
            class="text-sm whitespace-nowrap"
          >
            {{ menu.name }}
          </span>
        </RouterLink>
      </nav>

      <div class="p-4 border-t border-primary-foreground/10">
        <button
          @click="handleLogout"
          :class="[
            'flex items-center cursor-pointer gap-3 px-4 py-3 rounded-md w-full transition-all duration-200 hover:bg-red-500/20 text-red-400',
            isExpanded ? 'justify-start' : 'justify-center'
          ]"
        >
          <Icon icon="mdi:logout" class="text-xl shrink-0" />
          <span v-if="isExpanded" class="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  </aside>
</template>