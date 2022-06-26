<script setup lang="ts">
import type { NavItem } from '@nuxt/content/dist/runtime/types'

const route = useRoute()

/**
 *
 * toggle more options
 *
 */
const showMoreOptions = ref(false)

/**
 *
 *  toggle category options
 *
 */
const showCategoryOptions = ref(false)

/**
 * set sub nav panel
 */
const { data: navData } = await useAsyncData('navigation', () => fetchContentNavigation())

const categoryArr = ref([])

if (Array.isArray(navData.value) && navData.value.findIndex(item => item.title === 'Article') !== -1) {
  const articleFolder = navData.value.find(elem => elem.title.toLowerCase() === 'article')
  if (articleFolder && articleFolder.children) {
    categoryArr.value = articleFolder.children
  }
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

/**
 *
 * toggle catalog
 *
 */
const showCatalog = useShowCatalog()
</script>

<template>
  <div class="relative">
    <!-- <Transition
      enter-from-class="translate-y-full opacity-0"
      enter-active-class="transition-all duration-300 ease-in"
      enter-to-class="translate-y-0 opacity-100"
      leave-from-class="translate-y-0 opacity-100"
      leave-active-class="transition-all duration-75 ease-out"
      leave-to-class="translate-y-full opacity-0"
    >
      <div
        v-show="showSubNav"
        class="max-h-[80vh] relative -z-10 bg-gray-50 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.1),0_-2px_4px_-2px_rgb(0,0,0,0.1)] shadow-gray-200"
      >
        <div
          v-if="categoryArr.length > 0"
          class="sub-nav-scroll-container p-4 grid grid-cols-3 auto-rows-max gap-2 overflow-y-auto"
        >
          <NuxtLink to="/list" class="sub-nav-item-card">
            <IconCustom name="ic:round-category" class="w-4/5" />
            <p class="text-xs font-bold text-center">
              All
            </p>
          </NuxtLink>
          <template v-for="item in categoryArr as NavItem[]">
            <NuxtLink
              v-if="item.children"
              :key="item._path"
              :to="{ path: '/list', query: { category: item.title.toLowerCase() } }"
              class="sub-nav-item-card"
            >
              <IconCustom name="ic:round-category" class="w-4/5" />
              <p class="text-xs font-bold text-center">
                {{ item.title }}
              </p>
            </NuxtLink>
          </template>
        </div>
      </div>
    </Transition> -->
    <div
      class="py-0.5 sm:hidden sticky bottom-0 inset-x-0 flex justify-between items-center bg-gray-50 border-t border-gray-50 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.1),0_-2px_4px_-2px_rgb(0,0,0,0.1)] shadow-gray-200"
    >
      <button
        v-show="!showCategoryOptions"
        class="py-3 relative z-10 flex flex-col justify-center items-center space-y-1 bg-gray-50"
        :class="showMoreOptions ? 'px-4 text-purple-500 shadow-[4px_0_4px_-4px_rgb(0,0,0,0.1),2px_0_2px_-2px_rgb(0,0,0,0.1)] shadow-gray-300' : 'px-6 text-gray-500'"
        @click="showMoreOptions = !showMoreOptions"
      >
        <img
          src="@/assets/avatar.png"
          alt="avatar"
          class="w-6 h-6 rounded-full ring-2"
          :class="showMoreOptions ? 'ring-purple-300' : 'ring-gray-50'"
        >
        <p class="text-xs">
          More
        </p>
      </button>

      <Transition
        enter-from-class="-translate-x-full opacity-0"
        enter-active-class="transition-all duration-300 ease-in"
        enter-to-class="translate-x-0 opacity-100"
      >
        <div
          v-show="showMoreOptions"
          class="options-container px-4 relative -z-10 grow flex items-center gap-4 text-sm overflow-x-auto"
        >
          <NuxtLink to="/" class="option-item" @click="showMoreOptions = false">
            Home
          </NuxtLink>
          <NuxtLink to="/about" class="option-item" @click="showMoreOptions = false">
            About
          </NuxtLink>
          <NuxtLink to="/rss" class="option-item" @click="showMoreOptions = false">
            RSS
          </NuxtLink>
        </div>
      </Transition>

      <button
        v-show="!showMoreOptions"
        class="py-3 relative z-10 flex flex-col justify-center items-center space-y-1 bg-gray-50"
        :class="showCategoryOptions ? 'px-4 text-purple-500 shadow-[4px_0_4px_-4px_rgb(0,0,0,0.1),2px_0_2px_-2px_rgb(0,0,0,0.1)] shadow-gray-300' : 'px-6 text-gray-500'"
        @click="showCategoryOptions = !showCategoryOptions"
      >
        <IconCustom name="ic:round-category" class="w-6 h-6" />
        <p class="text-xs">
          Category
        </p>
      </button>

      <Transition
        enter-from-class="-translate-x-full opacity-0"
        enter-active-class="transition-all duration-300 ease-in"
        enter-to-class="translate-x-0 opacity-100"
      >
        <div
          v-show="showCategoryOptions"
          class="options-container px-4 relative -z-10 grow flex items-center gap-4 text-sm overflow-x-auto"
        >
          <NuxtLink to="/list" class="option-item" @click="showCategoryOptions = false">
            all
          </NuxtLink>
          <template v-for="item in categoryArr as NavItem[]">
            <NuxtLink
              v-if="item.children"
              :key="item._path"
              :to="{ path: '/list', query: { category: item.title.toLowerCase() } }"
              class="option-item"
              @click="showCategoryOptions = false"
            >
              {{ item.title }}
            </NuxtLink>
          </template>
        </div>
      </Transition>

      <button
        v-if="route.path && route.path.startsWith('/article')"
        v-show="!showMoreOptions && !showCategoryOptions"
        class="py-3 px-6 flex flex-col justify-center items-center space-y-1 bg-gray-50"
        :class="showCatalog ? 'text-purple-500' : ' text-gray-500'"
        @click="showCatalog = !showCatalog"
      >
        <IconCustom name="entypo:list" class="w-6 h-6" />
        <p class="text-xs">
          catalog
        </p>
      </button>

      <button
        v-show="!showMoreOptions && !showCategoryOptions"
        :title="`toggle flex mode to ${flexiMode === 'blog' ? 'note' : 'blog'}`"
        class="mx-6 w-11 h-11 flex justify-center items-center gap-1 bg-purple-100 hover:bg-purple-200 transition-colors duration-300 rounded-lg"
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

.options-container::-webkit-scrollbar {
  display: none;
}

.option-item {
  @apply p-2 text-purple-500 bg-purple-50 hover:bg-purple-100 border border-purple-500 rounded;
}

.sub-nav-scroll-container::-webkit-scrollbar {
  display: none;
}

.sub-nav-item-card {
  @apply p-4 flex flex-col justify-center items-center space-y-2 text-purple-500 bg-purple-50 hover:bg-purple-100 border border-purple-400 rounded
}
</style>
