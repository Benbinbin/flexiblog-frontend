<script setup lang="ts">
import type { NavItem } from '@nuxt/content/dist/runtime/types'
const { data: navArr } = await useAsyncData('navigation', () => fetchContentNavigation())

// console.log(navArr)
</script>
<template>
  <div class="flex justify-between items-start max-w-2xl px-4 py-4 mx-auto sm:px-8">
    <!-- Navigation -->
    <div class="text-gray-700 dark:text-gray-200">
      <NavList :navigation="navArr as NavItem[]" />
    </div>
    <!-- Social icons & Color Mode -->
    <div class="space-x-3 text-gray-500 transition">
      <a href="https://twitter.com/Atinux" title="Twitter" class="hover:text-gray-700 dark:hover:text-gray-300">
        <IconCustom name="fa-brands:twitter" />
      </a>
      <a
        href="https://github.com/Atinux/content-wind"
        title="GitHub"
        class="hover:text-gray-700 dark:hover:text-gray-300"
      >
        <IconCustom name="fa-brands:github" />
      </a>
      <ColorModeSwitch class="hover:text-gray-700 dark:hover:text-gray-300" />
    </div>
  </div>
</template>
