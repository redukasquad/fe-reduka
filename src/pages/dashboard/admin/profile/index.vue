<script setup lang="ts">
import { useAuth } from '../../../../stores/auth'
import ProfileCard from '../../../../components/dashboard/shared/ProfileCard.vue'
import ProfileForm from '../../../../components/dashboard/shared/ProfileForm.vue'
import DangerZone from '../../../../components/dashboard/shared/DangerZone.vue'
import ToastNotification from '../../../../components/dashboard/user/ToastNotification.vue'
import DashboardLayout from '../../../../components/layout/DashboardLayout.vue'

const auth = useAuth()
</script>

<template>
  <DashboardLayout class="p-6 max-w-2xl mx-auto space-y-5">
    <div>
      <h1 class="text-xl font-extrabold text-gray-900">Pengaturan Profil</h1>
      <p class="text-sm text-gray-500 mt-0.5">Kelola informasi akun kamu</p>
    </div>
    <ProfileCard :user="auth.user" />
    <ProfileForm />
    <DangerZone />
    <ToastNotification />
  </DashboardLayout>
</template>
