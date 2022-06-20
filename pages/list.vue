<script setup lang="ts">
import type { NavItem, ParsedContent } from '@nuxt/content/dist/runtime/types'

interface MyCustomParsedContent extends ParsedContent {
  tags: string[]
}

const route = useRoute()

// console.log(route)

/**
 *
 * category filter
 *
 */
const { data: navData } = await useAsyncData('navigation', () => fetchContentNavigation())

let articleFolder

if (Array.isArray(navData.value) && navData.value.findIndex(item => item.title.toLowerCase() === 'article') !== -1) {
  articleFolder = navData.value.find(elem => elem.title.toLowerCase() === 'article')
}

const currentCategory = ref(route.query.category as string || 'all')
const showMoreCategory = ref(false)

const setCategory = (value) => {
  currentTags.value = []
  currentSeries.value = 'all'
  currentCategory.value = value
}

/**
 *
 * tag and series filter
 *
 */
const showMoreFilter = ref(false)

let tagSet, seriesSet

const tagArr = []
const seriesArr = []

interface ArrayObject {
  [key: string]: string[]
}

const categoryTags: ArrayObject = {}
const categorySeries: ArrayObject = {}

if (articleFolder && articleFolder.children.length > 0) {
  for (const category of articleFolder.children as NavItem[]) {
    const { data } = await useAsyncData(`${category.title}-tags`, () => queryContent<MyCustomParsedContent>('article', category.title.toLowerCase()).only(['tags', 'series']).find())

    const categoryTagsArr = []
    const categorySeriesArr = []
    data.value.forEach((item) => {
      if (item.tags) {
        categoryTagsArr.push(...item.tags)
        tagArr.push(...item.tags)
      }
      if (item.series) {
        categorySeriesArr.push(item.series)
        seriesArr.push(item.series)
      }
    })

    categoryTags[category.title.toLowerCase()] = [...new Set(categoryTagsArr)]
    categorySeries[category.title.toLowerCase()] = [...new Set(categorySeriesArr)]
  }

  tagSet = new Set(tagArr)
  seriesSet = new Set(seriesArr)
}

const currentTags = ref([])

if (typeof route.query.tags === 'string') {
  currentTags.value = [route.query.tags]
} else if (Array.isArray(route.query.tags)) {
  currentTags.value = route.query.tags
}

const toggleTag = (tag) => {
  if (tag === 'all') {
    currentTags.value = []
    return
  }

  if (currentTags.value.length > 0) {
    const index = currentTags.value.findIndex(element => element === tag)
    if (index !== -1) {
      currentTags.value.splice(index, 1)
    } else {
      currentTags.value.push(tag)
    }
  } else {
    currentTags.value.push(tag)
  }
}

const currentSeries = ref(route.query.series as string || 'all')

const showMoreTag = ref(false)
const showMoreSeries = ref(false)

watch([currentCategory, currentTags, currentSeries], () => {
  navigateTo({
    path: '/list',
    query: {
      category: currentCategory.value,
      tags: currentTags.value,
      series: currentSeries.value
    }
  })
}, {
  deep: true
})

/**
 *
 * query article list
 *
 */

function getArticleList () {
  let contentQuery

  if (route.query.category && route.query.category !== 'all') {
    contentQuery = queryContent('article', route.query.category as string)
  } else {
    contentQuery = queryContent('article')
  }

  if (route.query.tags) {
    let tags = []
    if (typeof route.query.tags === 'string') {
      tags = [route.query.tags]
    } else if (Array.isArray(route.query.tags)) {
      tags = route.query.tags
    }
    contentQuery.where({ tags: { $contains: tags } })
  }

  if (route.query.series && route.query.series !== 'all') {
    contentQuery.where({ series: route.query.series })
  }

  contentQuery.only(['title', 'description', '_path', 'contentType', 'cover', 'series', 'seriesOrder', 'tags'])

  return contentQuery.find()
}

const { pending, data: result, refresh } = await useAsyncData('articles', () => getArticleList())

watch(() => route.fullPath, () => {
  if (route.path !== '/list') { return }
  refresh()
}, {
  immediate: true
})

/**
 *
 * show article list detail
 */
const showDetail = ref(false)

</script>

<template>
  <div>
    <NuxtLayout name="base">
      <div class="p-8 flex items-start space-x-2">
        <button
          class="shrink-0 p-2.5 flex justify-center items-center transition-colors duration-300 rounded"
          :class="showMoreFilter ? 'bg-blue-400 hover:bg-blue-300 text-white' : 'bg-blue-100 text-blue-400 hover:text-blue-500'"
          @click="showMoreFilter = !showMoreFilter"
        >
          <IconCustom name="mdi:filter-plus-outline" class="w-6 h-6" />
        </button>
        <div class="grow space-y-2">
          <div class="p-2 flex items-start text-sm bg-gray-100 rounded space-x-4">
            <button
              class="shrink-0 px-2 py-1 flex items-center text-gray-500 hover:bg-gray-200 rounded"
              @click="showMoreCategory = !showMoreCategory"
            >
              <IconCustom
                name="ic:round-keyboard-arrow-right"
                class="w-5 h-5 transition-transform duration-300"
                :class="showMoreCategory ? 'rotate-90' : 'rotate-0'"
              />
              <p>Category</p>
            </button>
            <ul
              v-if="articleFolder"
              class="grow flex flex-wrap gap-2 overflow-y-hidden transition-all duration-300"
              :class="showMoreCategory ? 'max-h-96' : 'max-h-8'"
            >
              <li
                v-for="category in [{ title: 'all', _path: 'all' }, ...articleFolder.children as NavItem[]]"
                :key="category._path"
              >
                <button
                  class="px-2 py-1 flex items-center space-x-1 transition-colors duration-300 rounded"
                  :class="currentCategory === category.title.toLowerCase() ? 'text-white bg-blue-500 hover:bg-blue-400' : 'text-blue-500/80 hover:text-blue-500 bg-blue-100'"
                  @click="setCategory(category.title.toLowerCase())"
                >
                  <IconCustom name="material-symbols:category-rounded" class="w-5 h-5" />
                  <p>
                    {{ category.title.toLowerCase() }}
                  </p>
                </button>
              </li>
            </ul>
          </div>

          <Transition
            enter-from-class=" transform -translate-y-8 opacity-0"
            enter-active-class="transition-all duration-300 ease-out"
            enter-to-class="transform translate-y-0 opacity-100"
            leave-from-class="transform translate-y-0 opacity-100"
            leave-active-class="transition-all duration-100 ease-in"
            leave-to-class="transform -translate-y-8 opacity-0"
          >
            <div v-show="showMoreFilter" class="space-y-2">
              <div class="p-2 flex items-start text-sm bg-gray-100 rounded space-x-4">
                <button
                  class="shrink-0 px-2 py-1 flex items-center text-gray-500 hover:bg-gray-200 rounded"
                  @click="showMoreTag = !showMoreTag"
                >
                  <IconCustom
                    name="ic:round-keyboard-arrow-right"
                    class="w-5 h-5 transition-transform duration-300"
                    :class="showMoreTag ? 'rotate-90' : 'rotate-0'"
                  />
                  <p>Tags</p>
                </button>

                <ul
                  v-if="tagSet"
                  class="grow flex flex-wrap gap-2 overflow-y-hidden transition-all duration-300"
                  :class="showMoreTag ? 'max-h-96' : 'max-h-8'"
                >
                  <li v-for="tag in ['all', ...tagSet as string[]]" :key="tag">
                    <button
                      class="px-2 py-1 flex items-center space-x-1 transition-colors duration-300 rounded disabled:opacity-30"
                      :class="(currentTags.length === 0 && tag === 'all') || currentTags.includes(tag) ? 'text-white bg-blue-500 hover:bg-blue-400' : 'text-blue-500/80 hover:text-blue-500 bg-blue-100'"
                      :disabled="(tag === 'all' || currentCategory === 'all' || categoryTags[currentCategory].includes(tag)) ? false : true"
                      @click="toggleTag(tag)"
                    >
                      <p>#{{ tag }}</p>
                    </button>
                  </li>
                </ul>
              </div>
              <div class="p-2 flex items-start text-sm bg-gray-100 rounded space-x-4">
                <button
                  class="shrink-0 px-2 py-1 flex items-center text-gray-500 hover:bg-gray-200 rounded"
                  @click="showMoreSeries = !showMoreSeries"
                >
                  <IconCustom
                    name="ic:round-keyboard-arrow-right"
                    class="w-5 h-5 transition-transform duration-300"
                    :class="showMoreSeries ? 'rotate-90' : 'rotate-0'"
                  />
                  <p>Series</p>
                </button>

                <ul
                  v-if="seriesSet"
                  class="grow flex flex-wrap gap-2 overflow-y-hidden transition-all duration-300"
                  :class="showMoreSeries ? 'max-h-96' : 'max-h-8'"
                >
                  <li v-for="series in ['all', ...seriesSet as string[]]" :key="series">
                    <button
                      class="px-2 py-1 flex items-center space-x-1 transition-colors duration-300 rounded disabled:opacity-30"
                      :class="currentSeries === series ? 'text-white bg-blue-500 hover:bg-blue-400' : 'text-blue-500/80 hover:text-blue-500 bg-blue-100'"
                      :disabled="(series === 'all' || currentCategory === 'all' || categorySeries[currentCategory].includes(series)) ? false : true"
                      @click="currentSeries = series"
                    >
                      <IconCustom name="bi:collection" class="w-5 h-5" />
                      <p>{{ series }}</p>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </Transition>
        </div>
      </div>
      <hr>
      <button @click="showDetail = !showDetail">
        show Detail
      </button>
      <div v-if="pending">
        loading
      </div>
      <div v-if="result" class="container p-8 mx-auto space-y-4">
        <ul class="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
          <li v-for="item in result as ParsedContent" :key="item._path" class="flex justify-between items-end">
            <NuxtLink
              :to="item._path"
              class="grow px-4 py-2 text-gray-600 hover:text-blue-500 hover:bg-blue-100 transition-colors duration-300 rounded-lg space-y-2"
            >
              <div class="flex items-start">
                <div class="shrink-0 p-1 flex justify-center items-center">
                  <IconCustom
                    :name="(!item.contentType || item.contentType === 'blog') ? 'ant-design:file-markdown-filled' : 'bi:filetype-json'"
                    class="w-4 h-4"
                  />
                </div>
                <h2 class="grow font-bold">
                  {{ item.title }}
                </h2>
              </div>
              <p v-if="showDetail && item.description" class="px-6 text-sm opacity-60 ">
                {{ item.description }}
              </p>
            </NuxtLink>
            <div class="p-2 flex items-end shrink-0">
              <button
                class="px-2 py-1 flex justify-center items-center text-green-400 hover:text-green-500 bg-green-50  transition-colors duration-300 rounded"
              >
                <IconCustom name="bi:collection" class="h-4" />
              </button>
            </div>
          </li>
        </ul>
        <!-- <pre>{{ currentCategory }}</pre>
        <pre>{{ currentTags }}</pre>
        <pre>{{ currentSeries }}</pre>
        <pre>{{ result }}</pre> -->
      </div>
    </NuxtLayout>
  </div>
</template>

<style scoped>
</style>
