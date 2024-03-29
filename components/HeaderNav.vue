<script setup lang="ts">
import type { NavItem } from '@nuxt/content/dist/runtime/types'

/**
 * set sub nav panel
 */
const { data: navData } = await useAsyncData('navigation', () => fetchContentNavigation())

let articleFolder

if (Array.isArray(navData.value) && navData.value.findIndex(item => item.title === 'Article') !== -1) {
  articleFolder = navData.value.find(elem => elem.title.toLowerCase() === 'article')
}

const showSubNav = ref(false)

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
      <NuxtLink :to="'/'" class="hover:">
        <img src="@/assets/avatar.png" alt="avatar" class="w-8 h-8 rounded-full">
      </NuxtLink>
      <div class="flex items-center gap-6">
        <button
          class="btn hidden sm:block"
          @mouseover="setSubNav(true)"
          @mouseleave="setSubNav(false)"
          @click="showSubNav=!showSubNav"
        >
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
          class="hidden w-10 h-10 sm:flex justify-center items-center gap-1 bg-purple-100 hover:bg-purple-200 transition-colors duration-300 rounded-lg"
          :class="flexiMode === 'blog' ? 'flex-col' : 'flex-row'"
          @click="changeFlexiMode"
        >
          <div class="shrink-0 w-2 h-2 rounded-full bg-purple-500" />
          <div class="shrink-0 space-y-1">
            <div class="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <div class="w-1.5 h-1.5 rounded-full bg-purple-400" />
          </div>
        </button>
      </div>
    </div>
    <Transition
      enter-from-class="translate-y-0"
      enter-active-class="transition-all duration-300 ease-in"
      enter-to-class="translate-y-full"
      leave-from-class="translate-y-full"
      leave-active-class="transition-all duration-75 ease-out"
      leave-to-class="translate-y-0"
      @after-enter="onAfterEnter"
    >
      <div
        v-show="showSubNav"
        class="sub-nav-scroll-container w-full max-h-[60vh] overflow-y-auto overscroll-y-none absolute -z-10 bottom-0 inset-x-0 hidden sm:flex justify-center items-start bg-gray-50 shadow-md shadow-gray-200"
        @mouseover="setSubNav(true)"
        @mouseleave="setSubNav(false)"
      >
        <div v-if="articleFolder" class="sub-nav-items-container max-w-full px-6 py-8">
          <NuxtLink to="/list" class="sub-nav-item-card" @click="showSubNav=false">
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
  @apply p-2 font-bold text-purple-500 hover:bg-purple-100 transition-colors duration-300 rounded-md
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
  @apply p-4 flex flex-col justify-center items-center space-y-2 text-purple-500 bg-purple-50 hover:bg-purple-100 border border-purple-100 transition-colors duration-300 rounded-lg
}
</style>
