<script setup lang="ts">
import type { NavItem } from '@nuxt/content/dist/runtime/types'
// const { data: categoryArr } = await useAsyncData('navigation', () => fetchContentNavigation())

// const { data: article } = await useAsyncData('Article', () => queryContent('/').findOne())

// console.log(categoryArr)

// console.log(article)

/**
 * set sub nav panel
 */
const { data: navData } = await useAsyncData('navigation', () => fetchContentNavigation())

let articleFolder

if (Array.isArray(navData.value) && navData.value.findIndex(item => item.title === 'Article') !== -1) {
  articleFolder = navData.value.find(elem => elem.title.toLowerCase() === 'article')
}

const showSubNav = useShowSubNav()

let timer = null

const setSubNav = (show) => {
  if (show) {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }

    showSubNav.value = true
  }

  if (!show) {
    timer = setTimeout(() => {
      showSubNav.value = false
      timer = null
    }, 500)
  }
}

/**
 * sub transition effect
 */
const onAfterEnter = (el) => {
  el.classList.add('transform')
  el.classList.add('translate-y-full')
}

/**
 *
 * toggle flexible mode
 *
 */
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
  <div class="relative">
    <div
      class="px-4 py-3 flex justify-between items-center text-sm bg-gray-50 border-b"
      :class="showSubNav ? 'border-gray-200' : 'border-gray-50 shadow-md shadow-gray-200'"
    >
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
      <div class="hidden sm:flex items-center gap-6">
        <button class="btn" @mouseover="setSubNav(true)" @mouseleave="setSubNav(false)" @click="showSubNav=!showSubNav">
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
          class="w-10 h-10 flex justify-center items-center gap-1 bg-blue-100 hover:bg-blue-50 transition-colors duration-300 rounded-lg"
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
    <Transition
      enter-from-class="transform translate-y-0"
      enter-active-class="transition-all duration-300 ease-in"
      enter-to-class="transform translate-y-full"
      leave-from-class="transform translate-y-full"
      leave-active-class="transition-all duration-75 ease-out"
      leave-to-class="transform translate-y-0"
      @after-enter="onAfterEnter"
    >
      <div
        v-show="showSubNav"
        class="sub-nav-scroll-container w-full max-h-[60vh] overflow-y-auto overscroll-y-none absolute -z-10 bottom-0 inset-x-0 hidden sm:flex justify-center items-start bg-gray-50 shadow-md shadow-gray-200"
        @mouseover="setSubNav(true)"
        @mouseleave="setSubNav(false)"
      >
        <div v-if="articleFolder" class="sub-nav-items-container max-w-full px-6 py-8">
          <NuxtLink to="/list" class="sub-nav-item-card">
            <IconCustom name="material-symbols:category-rounded" class="w-8 h-8" />
            <p class="py-2 font-bold text-center">
              All
            </p>
          </NuxtLink>
          <template v-for="category in articleFolder.children as NavItem[]">
            <NuxtLink
              v-if="category.children"
              :key="category._path"
              :to="{ path: '/list', query: { category: category.title.toLowerCase() } }"
              class="sub-nav-item-card"
              @click="showSubNav=false"
            >
              <IconCustom name="material-symbols:category-rounded" class="w-8 h-8" />
              <p class="py-2 font-bold text-center">
                {{ category.title }}
              </p>
            </NuxtLink>
          </template>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">

.btn {
  @apply p-2 font-bold text-blue-500 hover:bg-blue-50 transition-colors duration-300 rounded-md
}

.sub-nav-scroll-container::-webkit-scrollbar {
  display: none;
}

.sub-nav-items-container {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  justify-content: center;
}

.sub-nav-item-card {
  @apply px-8 py-4 flex flex-col justify-center items-center space-y-2 text-blue-400 hover:text-blue-500 border-2 border-blue-100 hover:bg-blue-100 transition-colors duration-300 rounded-lg
}
</style>
