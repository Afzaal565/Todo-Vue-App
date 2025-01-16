<script setup lang="ts">
import { RouterView } from 'vue-router'
import CommonNavbar from './components/CommonNavbar.vue'
</script>

<template>
  <div id="app" class="min-h-screen bg-gray-100">
    <CommonNavbar />
    <main class="container mx-auto p-4">
      <RouterView />
    </main>
  </div>
</template>
