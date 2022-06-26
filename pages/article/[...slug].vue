<script setup lang="ts">
import type { ParsedContent } from '@nuxt/content/dist/runtime/types'

const route = useRoute()

// console.log(route)

const { data, pending } = await useAsyncData(`${route.path}`, () => queryContent<ParsedContent>(route.path).findOne())

// console.log(data)

/**
 *
 * catalog
 *
 */
const showCatalog = useShowCatalog()

// set catalog width
const catalogWidth = ref(0)

onMounted(() => {
  const setCatalogWidth = () => {
    catalogWidth.value = (document.documentElement.clientWidth - 896) / 2
    console.log(catalogWidth.value)
  }

  setCatalogWidth()

  let resizeTimer = null
  window.onresize = () => {
    if (resizeTimer) {
      clearTimeout(resizeTimer)
    }
    resizeTimer = setTimeout(() => {
      setCatalogWidth()
      resizeTimer = null
    }, 300)
  }
})

</script>

<template>
  <div>
    <NuxtLayout name="base">
      <ContentRenderer
        v-if="!pending && data"
        :value="data"
        class="article-container container mx-auto lg:max-w-4xl px-6 md:px-12 py-12"
      >
        <template #empty>
          <div class="article-container container mx-auto lg:max-w-4xl px-6 md:px-12 py-12">
            <h1>Article is empty</h1>
          </div>
        </template>
      </ContentRenderer>
    </NuxtLayout>
    <div
      class="catalog-container h-full max-h-[80%] overflow-y-auto p-4 hidden xl:flex flex-col justify-center items-start fixed top-1/2 right-0 -translate-y-1/2"
      :style="`width: ${catalogWidth}px`"
    >
      <ul v-if="!pending && data?.body?.toc && data.body.toc.links.length>0" v-show="true" class="w-full">
        <CatalogItem
          v-for="catalog in data.body.toc.links"
          :key="catalog.id"
          :item="catalog"
          :depth="catalog.depth || 2"
        />
      </ul>
    </div>
  </div>
</template>

<style lang="scss">

.article-container {
  * {
    @apply selection:bg-purple-400 selection:text-white
  }

  p a {
    @apply text-blue-500 underline decoration-4 decoration-blue-400 hover:decoration-blue-500 visited:decoration-blue-100 hover:visited:decoration-blue-200 transition-colors duration-300;
  }

  p {
    @apply text-base;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    @apply font-bold;
  }

  h2,
  h3,
  h4,
  h5,
  h6 {
    @apply before:font-light before:mr-1 before:text-purple-300 sm:before:opacity-50 hover:sm:before:opacity-100 before:transition-opacity before:duration-300;
  }

  h1 {
    @apply py-8 md:py-12 text-3xl md:text-5xl text-center;
  }

  h2 {
    @apply py-4 text-2xl md:text-3xl before:content-['H2'] before:text-sm md:before:text-lg sm:-translate-x-6;
  }

  h3 {
    @apply py-4 text-xl md:text-2xl before:content-['H3'] before:text-sm md:before:text-base sm:-translate-x-5;
  }

  h4 {
    @apply py-2 text-lg md:text-xl before:content-['H4'] before:text-xs md:before:text-sm sm:-translate-x-4;
  }

  h5 {
    @apply py-2 text-lg md:text-xl before:content-['H5'] before:text-xs md:before:text-sm sm:-translate-x-4;
  }

  h6 {
    @apply py-2 text-lg md:text-xl before:content-['H6'] before:text-xs md:before:text-sm sm:-translate-x-4;
  }

  div,
  p,
  blockquote,
  img,
  dl,
  pre {
    @apply my-4
  }

  table {
    @apply my-0.5
  }

  hr {
    @apply text-gray-400
  }

  ul,
  ol {
    @apply pl-4 my-2;

    li {
      @apply my-1
    }
  }

  ul {
    @apply list-disc;
  }

  ol {
    @apply list-decimal;
  }

  dl {
    dt {
      @apply font-bold italic my-2
    }

    dd {
      @apply pl-4
    }
  }

  blockquote {
    @apply px-2 border-l-4 border-gray-300
  }

  table {
    @apply mx-auto table-auto;

    thead tr,
    tr:nth-child(2n) {
      @apply bg-gray-100;
    }

    th,
    td {
      @apply px-4 py-2 border border-gray-200 text-center
    }
  }

  img {
    @apply max-w-full mx-auto
  }

  code {
    @apply px-1 py-0.5 mx-0.5 text-sm bg-gray-100 border rounded
  }

  pre {
    @apply px-4 py-2 bg-gray-800 overflow-auto rounded-lg;

    code {
      @apply p-0 m-0 whitespace-pre bg-transparent border-0
    }
  }
}

.catalog-container {
  &::-webkit-scrollbar {
    display: none;
  }

  // .heading-mark, button {
  //   opacity: 50%;
  //   transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  //   transition-duration: 300ms;
  // }

  // &:hover {
  //   .heading-mark, button {
  //     opacity: 100%
  //   }
  // }
}
</style>
