<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div>
    <header class="flex bg-sky-900 text-white items-center justify-center p-3 flex-col cursor-pointer" @click="router.currentRoute.value.path !== '/' && router.push('/')">
      <h1>GoA II Character Reference</h1>
      <nav v-if="router.currentRoute.value.path !== '/'">
        <router-link to="/">← Back to Characters</router-link>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<style scoped></style>
