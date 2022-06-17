<script setup lang="ts">
// import type { NavItem } from '@nuxt/content/dist/runtime/types'
// const { data: categoryArr } = await useAsyncData('navigation', () => fetchContentNavigation())

// const { data: article } = await useAsyncData('Article', () => queryContent('/').findOne())

// console.log(categoryArr)

// console.log(article)

const flexiMode = useFlexiMode()

const changeFlexiMode = () => {
  if (flexiMode.value === 'blog') {
    flexiMode.value = 'note'
  } else {
    flexiMode.value = 'blog'
  }
}
</script>
<template>
  <div class="px-4 py-3 flex justify-between items-center text-sm shadow-md">
    <!-- <div class="flex justify-between items-start max-w-2xl px-4 py-4 mx-auto sm:px-8">
    <div class="text-gray-700 dark:text-gray-200">
      <NavList :navigation="navArr as NavItem[]" />
    </div>
    <div class="space-x-3 text-gray-500 transition">
      <a href="https://twitter.com/Atinux" title="Twitter" class="hover:text-gray-700 dark:hover:text-gray-300">
        <IconCustom name="fa-brands:twitter" />
      </a>
      <a href="https://github.com/Atinux/content-wind" title="GitHub"
        class="hover:text-gray-700 dark:hover:text-gray-300">
        <IconCustom name="fa-brands:github" />
      </a>
      <ColorModeSwitch class="hover:text-gray-700 dark:hover:text-gray-300" />
    </div>
  </div> -->
    <NuxtLink :to="'/'" class="hover:">
      <img src="@/assets/avatar.png" alt="avatar" class="w-8 h-8 rounded-full">
    </NuxtLink>
    <div class="flex items-center gap-6">
      <button class="btn">
        Category
      </button>
      <NuxtLink to="/about" class="btn">
        About
      </NuxtLink>
      <button class="btn">
        RSS
      </button>
      <button
        :title="`toggle flex mode to ${flexiMode === 'blog' ? 'note' : 'blog'}`"
        class="btn w-10 h-10 flex justify-center items-center gap-1 bg-blue-100 hover:bg-blue-200 transition-colors duration-300 rounded-lg"
        :class="flexiMode === 'blog' ? 'flex-col' : 'flex-row'"
        @click="changeFlexiMode"
      >
        <div class="shrink-0 w-2 h-2 rounded-full bg-blue-500" />
        <div class="shrink-0 space-y-1">
          <div class="w-1.5 h-1.5 rounded-full bg-blue-400" />
          <div class="w-1.5 h-1.5 rounded-full bg-blue-400" />
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.btn {
  @apply p-2 font-bold text-blue-500 hover:bg-blue-100 transition-colors duration-300 rounded-md
}
</style>
