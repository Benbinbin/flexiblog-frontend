<script setup lang="ts">
import type { NavItem } from '@nuxt/content/dist/runtime/types'
defineProps<{ navigation: NavItem[] }>()
</script>

<template>
  <ul class=" text-gray-700 dark:text-gray-200">
    <li v-for="item in navigation" :key="item._path" class="px-4">
      <template v-if="item.children">
        <p>{{ item.title }}</p>
        <NavList :navigation="(item.children as NavItem[])" />
      </template>

      <NuxtLink v-else :to="item._path" active-class="font-bold" class="mr-4">
        {{ item.navTitle || item.title }}
      </NuxtLink>
    </li>
  </ul>
</template>
