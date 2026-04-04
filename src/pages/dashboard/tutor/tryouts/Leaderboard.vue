<script setup lang="ts">
import { useRoute } from 'vue-router'
import LeaderboardPage from '../../../../components/dashboard/shared/LeaderboardPage.vue'

const route = useRoute()
const tryoutId = Number(route.params.id)
</script>

<template>
  <LeaderboardPage :tryout-id="tryoutId" back-route-name="tutor-tryouts-view" />
</template>
