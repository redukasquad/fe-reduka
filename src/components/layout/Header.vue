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
    <!-- Rotating glow wrapper -->
    <div
      :class="[
        'glow-wrapper w-full max-w-[95%] rounded-2xl',
        scrolled ? 'glow-wrapper-scrolled' : 'glow-wrapper-default'
      ]"
    >
      <!-- Floating pill navbar -->
      <nav
        :class="[
          'nav-bar w-full transition-all duration-500 rounded-2xl',
          scrolled ? 'nav-scrolled py-2.5 px-5' : 'nav-default py-3 px-6'
        ]"
      >
        <!-- Sweep light effect -->
        <div class="sweep-light" />

        <div class="flex items-center justify-between relative z-10">

          <!-- ── Logo ─────────────────────────────────────────────────────── -->
          <RouterLink to="/" class="flex items-center gap-2.5 shrink-0 group" @click="closeAll">
            <div class="logo-orb w-8 h-8 rounded-xl flex items-center justify-center">
              <Image src="/images/core/logo.png" alt="REDUKA" class="w-5 h-5 object-contain relative z-10" />
            </div>
            <span class="brand-text font-extrabold text-base tracking-widest uppercase">
              REDUKA
            </span>
          </RouterLink>

          <!-- ── Desktop nav ────────────────────────────────────────────── -->
          <div class="hidden lg:flex items-center gap-1">
            <RouterLink
              v-for="menu in headerMenu"
              :key="menu.id"
              :to="menu.path"
              :class="[
                'nav-link relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium tracking-wide transition-all duration-300',
                route.path.startsWith(menu.path) ? 'nav-link-active' : 'nav-link-idle'
              ]"
            >
              <Icon :icon="menu.icon" class="text-base" />
              {{ menu.name }}
              <span v-if="route.path.startsWith(menu.path)" class="active-bar" />
            </RouterLink>
          </div>

          <!-- ── Desktop auth ───────────────────────────────────────────── -->
          <div class="hidden lg:flex items-center gap-2">
            <template v-if="!isLogin">
              <RouterLink to="/auth/login"
                class="login-btn px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 tracking-wide">
                Masuk
              </RouterLink>
              <RouterLink to="/auth/register"
                class="cta-btn px-4 py-2 rounded-xl text-sm font-semibold tracking-wide">
                Daftar
              </RouterLink>
            </template>

            <template v-else>
              <div class="relative">
                <button @click="profileOpen = !profileOpen"
                  class="profile-btn flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-300">
                  <div class="avatar-ring">
                    <img :src="user?.profileImage || '/profile.jpg'"
                      class="w-7 h-7 rounded-full object-cover" />
                  </div>
                  <span class="text-sm font-medium max-w-[100px] truncate username-text">
                    {{ user?.username }}
                  </span>
                  <Icon icon="mdi:chevron-down"
                    :class="['text-sm chevron-icon transition-transform duration-200', profileOpen ? 'rotate-180' : '']" />
                </button>

                <Transition
                  enter-from-class="opacity-0 scale-95 -translate-y-1"
                  enter-active-class="transition-all duration-150"
                  leave-to-class="opacity-0 scale-95 -translate-y-1"
                  leave-active-class="transition-all duration-150">
                  <div v-if="profileOpen" class="dropdown-panel absolute right-0 top-full mt-2 w-44 rounded-2xl overflow-hidden">
                    <RouterLink :to="dashboardRoute" @click="profileOpen = false"
                      class="dropdown-item flex items-center gap-2.5 px-4 py-3 text-sm">
                      <Icon icon="mdi:view-dashboard-outline" class="dropdown-icon" />
                      <span class="dropdown-text">Dashboard</span>
                    </RouterLink>
                    <div class="dropdown-divider" />
                    <button @click="logout"
                      class="dropdown-item w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-500 hover:text-red-600">
                      <Icon icon="mdi:logout" />
                      Keluar
                    </button>
                  </div>
                </Transition>
              </div>
            </template>
          </div>

          <!-- ── Mobile hamburger ──────────────────────────────────────── -->
          <button @click="mobileOpen = !mobileOpen"
            class="lg:hidden w-9 h-9 rounded-xl flex flex-col items-center justify-center gap-1.5 hamburger-btn transition-all duration-200">
            <span :class="['block h-0.5 w-5 rounded-full hamburger-line transition-all duration-300', mobileOpen ? 'rotate-45 translate-y-2' : '']" />
            <span :class="['block h-0.5 w-5 rounded-full hamburger-line transition-all duration-300', mobileOpen ? 'opacity-0' : '']" />
            <span :class="['block h-0.5 w-5 rounded-full hamburger-line transition-all duration-300', mobileOpen ? '-rotate-45 -translate-y-2' : '']" />
          </button>
        </div>
      </nav>
    </div>

    <!-- ── Mobile overlay ──────────────────────────────────────────────── -->
    <Transition enter-from-class="opacity-0" enter-active-class="transition-opacity duration-200"
      leave-to-class="opacity-0" leave-active-class="transition-opacity duration-200">
      <div v-if="mobileOpen" class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
        @click="mobileOpen = false" />
    </Transition>

    <!-- ── Mobile drawer ───────────────────────────────────────────────── -->
    <Transition enter-from-class="translate-x-full" enter-active-class="transition-transform duration-300"
      leave-to-class="translate-x-full" leave-active-class="transition-transform duration-300">
      <div v-if="mobileOpen" class="mobile-drawer fixed top-0 right-0 h-full w-72 z-50 lg:hidden flex flex-col">
        <!-- Drawer header -->
        <div class="flex items-center justify-between px-5 py-4 drawer-header-border">
          <div class="flex items-center gap-2">
            <div class="logo-orb w-7 h-7 rounded-lg flex items-center justify-center">
              <Image src="/images/core/logo.png" alt="REDUKA" class="w-4 h-4 object-contain" />
            </div>
            <span class="brand-text font-extrabold text-sm tracking-widest uppercase">REDUKA</span>
          </div>
          <button @click="mobileOpen = false"
            class="w-8 h-8 rounded-lg drawer-close-btn flex items-center justify-center transition-colors">
            <Icon icon="mdi:close" />
          </button>
        </div>

        <!-- Drawer nav -->
        <nav class="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
          <RouterLink
            v-for="menu in headerMenu"
            :key="menu.id"
            :to="menu.path"
            @click="mobileOpen = false"
            :class="[
              'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-all duration-200',
              route.path.startsWith(menu.path)
                ? 'mobile-nav-active'
                : 'mobile-nav-idle'
            ]"
          >
            <Icon :icon="menu.icon" class="text-lg" />
            {{ menu.name }}
          </RouterLink>
        </nav>

        <!-- Drawer auth -->
        <div class="px-4 py-5 drawer-footer-border space-y-2">
          <template v-if="!isLogin">
            <RouterLink to="/auth/login" @click="mobileOpen = false"
              class="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold drawer-login-btn transition-colors">
              Masuk
            </RouterLink>
            <RouterLink to="/auth/register" @click="mobileOpen = false"
              class="cta-btn flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold">
              Daftar Sekarang
            </RouterLink>
          </template>
          <template v-else>
            <div class="flex items-center gap-3 px-3 py-2 rounded-xl drawer-user-card mb-3">
              <div class="avatar-ring">
                <img :src="user?.profileImage || '/profile.jpg'" class="w-9 h-9 rounded-full object-cover" />
              </div>
              <div class="min-w-0">
                <p class="text-sm font-semibold drawer-username truncate">{{ user?.username }}</p>
                <p class="text-xs drawer-email truncate">{{ user?.email }}</p>
              </div>
            </div>
            <RouterLink :to="dashboardRoute" @click="mobileOpen = false"
              class="flex items-center gap-2 w-full py-3 px-4 rounded-xl text-sm font-semibold drawer-dashboard-btn transition-colors">
              <Icon icon="mdi:view-dashboard-outline" class="drawer-icon" />
              Dashboard
            </RouterLink>
            <button @click="logout"
              class="flex items-center gap-2 w-full py-3 px-4 rounded-xl text-sm font-semibold text-red-500 border border-red-200 hover:bg-red-50 transition-colors">
              <Icon icon="mdi:logout" />
              Keluar
            </button>
          </template>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
/* Register --angle as an animatable CSS property */
@property --angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

/* ── Rotating glow wrapper ────────────────────────────────────────────────── */
.glow-wrapper {
  position: relative;
  border-radius: 1rem; /* matches nav-bar rounded-2xl */
  /* NO overflow:hidden here — it would clip the dropdown panel */
}

/* Spin the gradient angle, NOT the element — no diagonal sweep */
.glow-wrapper::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.5px;
  --angle: 0deg;
  background: conic-gradient(
    from var(--angle),
    transparent 0deg,
    rgba(52, 211, 153, 0.7) 60deg,
    rgba(45, 212, 191, 0.8) 120deg,
    rgba(16, 185, 129, 0.6) 200deg,
    transparent 260deg,
    rgba(52, 211, 153, 0.5) 320deg,
    transparent 360deg
  );
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  mask-composite: exclude;
  pointer-events: none;
  z-index: 0;
  opacity: 0.8;
  filter: blur(0.3px);
  animation: rotateGradient 8s linear infinite;
}

.glow-wrapper-scrolled::before {
  opacity: 0.45;
}

@keyframes rotateGradient {
  from { --angle: 0deg; }
  to   { --angle: 360deg; }
}

/* ── Nav bar ──────────────────────────────────────────────────────────────── */
.nav-bar {
  background: linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%);
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.25), 0 1px 0 rgba(255,255,255,0.08) inset;
  position: relative;
  z-index: 0;
}

.nav-scrolled {
  background: #ffffff;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(16,185,129,0.12);
}

/* Sweep light animation */
.sweep-light {
  position: absolute;
  inset: 0;
  background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%);
  background-size: 200% 100%;
  animation: sweep 7s ease-in-out infinite;
  pointer-events: none;
}

@keyframes sweep {
  0%, 100% { background-position: -100% 0; }
  50%       { background-position: 200% 0; }
}

/* ── Logo ─────────────────────────────────────────────────────────────────── */
.logo-orb {
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.25);
  box-shadow: 0 0 12px rgba(16,185,129,0.3), inset 0 1px 0 rgba(255,255,255,0.1);
  transition: all 0.3s ease;
}

.logo-orb:hover {
  background: rgba(255,255,255,0.22);
  box-shadow: 0 0 20px rgba(16,185,129,0.5);
}

.nav-scrolled .logo-orb {
  background: rgba(5,150,105,0.1);
  border-color: rgba(5,150,105,0.25);
}

.brand-text {
  color: #ffffff;
  letter-spacing: 0.15em;
  text-shadow: 0 0 12px rgba(52,211,153,0.4);
  transition: text-shadow 0.3s ease;
}

.nav-scrolled .brand-text {
  color: #065f46;
  text-shadow: none;
}

/* ── Nav links ────────────────────────────────────────────────────────────── */
.nav-link {
  transition: all 0.3s ease;
}

.nav-link-idle {
  color: rgba(255,255,255,0.8);
}

.nav-link-idle:hover {
  color: #ffffff;
  background: rgba(255,255,255,0.12);
  transform: scale(1.03);
  box-shadow: 0 0 12px rgba(52,211,153,0.2);
}

.nav-scrolled .nav-link-idle {
  color: #374151;
}

.nav-scrolled .nav-link-idle:hover {
  color: #065f46;
  background: rgba(5,150,105,0.08);
  box-shadow: 0 0 12px rgba(5,150,105,0.15);
}

.nav-link-active {
  color: #ffffff;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.25);
  box-shadow: 0 0 16px rgba(52,211,153,0.3);
  animation: pulseGlow 2.5s ease-in-out infinite;
}

.nav-scrolled .nav-link-active {
  color: #065f46;
  background: rgba(5,150,105,0.1);
  border-color: rgba(5,150,105,0.3);
  box-shadow: 0 0 16px rgba(5,150,105,0.2);
  animation: pulseGlowScrolled 2.5s ease-in-out infinite;
}

@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 8px rgba(52,211,153,0.3); }
  50%       { box-shadow: 0 0 18px rgba(52,211,153,0.6); }
}

@keyframes pulseGlowScrolled {
  0%, 100% { box-shadow: 0 0 8px rgba(5,150,105,0.2); }
  50%       { box-shadow: 0 0 18px rgba(5,150,105,0.4); }
}

.active-bar {
  position: absolute;
  bottom: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  border-radius: 9999px;
  background: linear-gradient(90deg, transparent, #6ee7b7, transparent);
  box-shadow: 0 0 8px rgba(110,231,183,0.8);
}

/* ── Login / CTA buttons ──────────────────────────────────────────────────── */
.login-btn {
  color: rgba(255,255,255,0.85);
  transition: all 0.3s ease;
}

.login-btn:hover {
  color: #ffffff;
  background: rgba(255,255,255,0.1);
}

.nav-scrolled .login-btn {
  color: #374151;
}

.nav-scrolled .login-btn:hover {
  color: #065f46;
  background: rgba(5,150,105,0.08);
}

.cta-btn {
  background: rgba(255,255,255,0.18);
  border: 1px solid rgba(255,255,255,0.35);
  color: #ffffff;
  box-shadow: 0 0 14px rgba(52,211,153,0.2);
  transition: all 0.3s ease;
}

.cta-btn:hover {
  background: rgba(255,255,255,0.28);
  box-shadow: 0 0 22px rgba(52,211,153,0.35);
  transform: scale(1.02);
}

.nav-scrolled .cta-btn {
  background: #059669;
  border-color: #047857;
  color: #ffffff;
  box-shadow: 0 0 14px rgba(5,150,105,0.2);
}

.nav-scrolled .cta-btn:hover {
  background: #047857;
  box-shadow: 0 0 22px rgba(5,150,105,0.35);
}

/* ── Profile button ───────────────────────────────────────────────────────── */
.profile-btn {
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

.profile-btn:hover {
  background: rgba(255,255,255,0.1);
  border-color: rgba(255,255,255,0.2);
}

.nav-scrolled .profile-btn:hover {
  background: rgba(5,150,105,0.06);
  border-color: rgba(5,150,105,0.2);
}

.username-text { color: rgba(255,255,255,0.9); }
.nav-scrolled .username-text { color: #374151; }

.chevron-icon { color: rgba(255,255,255,0.5); }
.nav-scrolled .chevron-icon { color: #6b7280; }

/* ── Avatar ring ──────────────────────────────────────────────────────────── */
.avatar-ring {
  border-radius: 9999px;
  padding: 2px;
  background: linear-gradient(135deg, #34d399, #059669);
  box-shadow: 0 0 0 2px rgba(52,211,153,0.3), 0 0 10px rgba(52,211,153,0.5);
  animation: avatarPulse 3s ease-in-out infinite;
}

.avatar-ring img {
  display: block;
  border-radius: 9999px;
}

@keyframes avatarPulse {
  0%, 100% { box-shadow: 0 0 0 2px rgba(52,211,153,0.3), 0 0 8px rgba(52,211,153,0.4); }
  50%       { box-shadow: 0 0 0 3px rgba(52,211,153,0.5), 0 0 16px rgba(52,211,153,0.7); }
}

/* ── Dropdown ─────────────────────────────────────────────────────────────── */
.dropdown-panel {
  background: #ffffff;
  border: 1px solid rgba(5,150,105,0.15);
  box-shadow: 0 16px 40px rgba(0,0,0,0.12), 0 0 20px rgba(5,150,105,0.08);
}

.dropdown-item {
  transition: all 0.15s ease;
}

.dropdown-item:hover {
  background: rgba(5,150,105,0.06);
}

.dropdown-icon { color: #059669; }
.dropdown-text { color: #374151; }
.dropdown-divider { border-top: 1px solid #f3f4f6; }

/* ── Hamburger ────────────────────────────────────────────────────────────── */
.hamburger-btn:hover { background: rgba(255,255,255,0.1); }
.nav-scrolled .hamburger-btn:hover { background: rgba(5,150,105,0.08); }
.hamburger-line { background: rgba(255,255,255,0.85); }
.nav-scrolled .hamburger-line { background: #374151; }

/* ── Mobile drawer ────────────────────────────────────────────────────────── */
.mobile-drawer {
  background: #ffffff;
  border-left: 1px solid rgba(5,150,105,0.15);
  box-shadow: -16px 0 48px rgba(0,0,0,0.1);
}

.drawer-header-border { border-bottom: 1px solid #f0fdf4; }
.drawer-footer-border { border-top: 1px solid #f0fdf4; }

.drawer-close-btn {
  color: #6b7280;
}
.drawer-close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.mobile-nav-idle {
  color: #6b7280;
}
.mobile-nav-idle:hover {
  color: #065f46;
  background: rgba(5,150,105,0.06);
}

.mobile-nav-active {
  color: #065f46;
  background: rgba(5,150,105,0.08);
  border: 1px solid rgba(5,150,105,0.2);
  box-shadow: 0 0 12px rgba(5,150,105,0.1);
}

.drawer-user-card {
  background: #f0fdf4;
  border: 1px solid rgba(5,150,105,0.15);
}

.drawer-username { color: #111827; }
.drawer-email { color: #6b7280; }

.drawer-login-btn {
  color: #374151;
  border: 1px solid #e5e7eb;
}
.drawer-login-btn:hover {
  background: #f9fafb;
}

.drawer-dashboard-btn {
  color: #374151;
  border: 1px solid #e5e7eb;
}
.drawer-dashboard-btn:hover {
  background: #f0fdf4;
  color: #065f46;
}

.drawer-icon { color: #059669; }
</style>
