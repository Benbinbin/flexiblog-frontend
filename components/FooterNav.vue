<script setup lang="ts">
import type { NavItem } from '@nuxt/content/dist/runtime/types'

const route = useRoute()

/**
 * set sub nav panel
 */
const { data: navData } = await useAsyncData('navigation', () => fetchContentNavigation())

let articleFolder

if (Array.isArray(navData.value) && navData.value.findIndex(item => item.title === 'Article') !== -1) {
  articleFolder = navData.value.find(elem => elem.title.toLowerCase() === 'article')
}

const showSubNav = ref(false)

watch(showSubNav, () => {
  const body = document.body

  if (body && showSubNav.value) {
    body.classList.add('modal-open')
  };

  if (body && !showSubNav.value) {
    body.classList.remove('modal-open')
  }
})

/**
 * transition effect
 */
const onAfterEnter = (el) => {
  el.classList.add('transform')
  el.classList.add('-translate-y-full')
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
      v-show="showSubNav"
      class="sm:hidden w-screen h-screen  absolute -z-20 -translate-y-full"
      @click="showSubNav = false"
    />
    <Transition
      enter-from-class="translate-y-0"
      enter-active-class="transition-all duration-300 ease-in"
      enter-to-class="-translate-y-full"
      leave-from-class="-translate-y-full"
      leave-active-class="transition-all duration-75 ease-out"
      leave-to-class="translate-y-0"
      @after-enter="onAfterEnter"
    >
      <div
        v-show="showSubNav"
        class="max-h-[80vh] absolute top-0 inset-x-0 -z-10 sm:hidden bg-gray-50 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.1),0_-2px_4px_-2px_rgb(0,0,0,0.1)] shadow-gray-200"
      >
        <div
          v-if="articleFolder"
          class="sub-nav-scroll-container p-4 grid grid-cols-3 auto-rows-max gap-2 overflow-y-auto"
        >
          <NuxtLink to="/list" class="sub-nav-item-card" @click="showSubNav = false">
            <IconCustom name="ic:round-category" class="w-4/5" />
            <p class="text-xs font-bold text-center">
              All
            </p>
          </NuxtLink>
          <NuxtLink
            v-for="item in (articleFolder.children as NavItem[])"
            :key="item._path"
            :to="{ path: '/list', query: { category: item.title.toLowerCase() } }"
            class="sub-nav-item-card"
            @click="showSubNav = false"
          >
            <IconCustom name="ic:round-category" class="w-4/5" />
            <p class="text-xs font-bold text-center">
              {{ item.title }}
            </p>
          </NuxtLink>
        </div>
      </div>
    </Transition>
    <div
      class="sm:hidden sticky bottom-0 left-0 right-0 px-8 flex justify-between items-center bg-gray-50 border-t"
      :class="showSubNav ? 'border-gray-200' : 'border-gray-50 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.1),0_-2px_4px_-2px_rgb(0,0,0,0.1)] shadow-gray-200'"
    >
      <NuxtLink
        to="/"
        class="p-3 flex flex-col justify-center items-center space-y-1"
        :class="(!showSubNav && route.path === '/') ? 'text-purple-500' : 'text-gray-500'"
        @click="showSubNav = false"
      >
        <IconCustom name="ic:round-home" class="w-6 h-6" />
        <p class="text-xs">
          Home
        </p>
      </NuxtLink>
      <button
        class="p-3 flex flex-col justify-center items-center space-y-1"
        :class="showSubNav ? 'text-purple-500' : 'text-gray-500'"
        @click="showSubNav = !showSubNav"
      >
        <IconCustom name="ic:round-category" class="w-6 h-6" />
        <p class="text-xs">
          Category
        </p>
      </button>
      <button
        :title="`toggle flex mode to ${flexiMode === 'blog' ? 'note' : 'blog'}`"
        class="w-12 h-12 flex justify-center items-center gap-1 bg-purple-100 hover:bg-purple-200 transition-colors duration-300 rounded-lg"
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
</template>

<style scoped lang="scss">

.sub-nav-scroll-container::-webkit-scrollbar {
  display: none;
}

.sub-nav-item-card {
  @apply p-4 flex flex-col justify-center items-center space-y-2 text-purple-500 bg-purple-50 hover:bg-purple-100 border border-purple-400 rounded
}
</style>
