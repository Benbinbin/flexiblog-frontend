<script setup lang="ts">
import type { NavItem, QueryBuilderParams } from '@nuxt/content/dist/runtime/types'

const { data: navData } = await useAsyncData('navigation', () => fetchContentNavigation())

let categoryArr

if (Array.isArray(navData.value) && navData.value.findIndex(item => item.title === 'Article') !== -1) {
  categoryArr = navData.value.find(elem => elem.title === 'Article')
}

const queryCategoryArticlesParams: QueryBuilderParams = {
  limit: 8,
  only: ['title', 'description', 'cover', '_path']
}

// const flexiMode = useFlexiMode()

</script>

<template>
  <div>
    <NuxtLayout name="base">
      <div class="container px-8 py-16 mx-auto ">
        <div class="p-8 w-full flex flex-col sm:flex-row justify-between items-center sm:item-start gap-16 rounded-xl bg-blue-100">
          <ContentDoc class="content-container space-y-16">
            <template #not-found>
              <div class="content-container space-y-16">
                <h1>
                  Hi, welcome to my blog
                </h1>
                <p>
                  This blog is "flexible", which means you can click the button with <span
                    class="text-blue-600 font-bold"
                  >three
                    blue
                    dots</span> to switch between the
                  common
                  streaming layout and the carefully designed layout.
                </p>
              </div>
            </template>
          </ContentDoc>
          <img src="avatar.png" alt="avatar" class="hidden sm:block w-28 h-28 rounded-full">
        </div>
      </div>
      <div v-if="categoryArr" class="container p-8 mx-auto space-y-10">
        <template v-for="category in categoryArr.children as NavItem[]">
          <section v-if="category.children" :key="category._path" class="w-full sm:w-4/5 mx-auto space-y-2">
            <div class="flex justify-between items-start">
              <h2 class="pl-1 font-bold text-lg text-gray-500 border-l-8 border-blue-400">
                {{ category.title }}
              </h2>
              <NuxtLink
                :to="`/list?category=${category.title}`"
                class="p-2 text-xs text-blue-500 font-bold bg-blue-100 hover:bg-blue-200 transition-colors duration-300 rounded-lg"
              >
                More
              </NuxtLink>
            </div>
            <div class="space-y-4 divide-y divide-gray-200">
              <ContentList v-slot="{ list }" :path="category._path" :query="queryCategoryArticlesParams">
                <div v-for="article in list" :key="article._path" class="py-6">
                  <div class="grow space-y-4">
                    <NuxtLink
                      :to="article._path"
                      class="block text-3xl font-bold text-gray-600 hover:text-blue-400 transition-colors duration-300"
                    >
                      {{ article.title || "This Post Hasn't Title Yet" }}
                    </NuxtLink>
                    <p v-if="article.description" class="text-gray-400">
                      {{ article.description }}
                    </p>
                  </div>
                </div>
              </ContentList>
            </div>
          </section>
        </template>
      </div>
    </NuxtLayout>
  </div>
</template>

<style lang="scss">
.content-container h1 {
  @apply font-bold text-5xl text-blue-600
}

.content-container * {
  @apply text-blue-500 text-xl
}
</style>
