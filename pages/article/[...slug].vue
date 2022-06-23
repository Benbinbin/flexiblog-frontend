<script setup lang="ts">
// const route = useRoute()

// console.log(route)
</script>

<template>
  <div>
    <NuxtLayout name="base">
      <ContentDoc class="article-container container mx-auto px-6 md:px-12 py-12">
        <template #not-found>
          <p>There is no such articles found.</p>
        </template>
      </ContentDoc>
    </NuxtLayout>
  </div>
</template>

<style lang="scss">

.article-container {
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
    @apply font-bold before:font-light before:mr-1 before:text-purple-300 sm:before:opacity-0 hover:sm:before:opacity-100 before:transition-opacity before:duration-300;
  }

  h1 {
    @apply py-8 md:py-12 text-3xl md:text-5xl text-center;
  }

  h2 {
    @apply py-4 text-2xl md:text-3xl before:content-['H2'] before:text-sm md:before:text-lg;
  }

  h3 {
    @apply py-4 text-xl md:text-2xl before:content-['H3'] before:text-sm md:before:text-base
  }

  h4 {
    @apply py-2 text-lg md:text-xl before:content-['H4'] before:text-xs md:before:text-sm
  }

  h5 {
    @apply py-2 text-lg md:text-xl before:content-['H5'] before:text-xs md:before:text-sm
  }

  h6 {
    @apply py-2 text-lg md:text-xl before:content-['H6'] before:text-xs md:before:text-sm
  }

  p,
  blockquote,
  ul,
  ol,
  dl,
  li,
  table,
  pre {
    @apply my-4
  }

  hr {
    @apply text-gray-400
  }

  ul,
  ol {
    @apply pl-2
  }

  dl {
    padding: 0;
  }

  dl dt {
    font-size: 14px;
    font-weight: bold;
    font-style: italic;
    padding: 0;
    margin: 15px 0 5px;
  }

  dl dt:first-child {
    padding: 0;
  }

  dl dt> :first-child {
    margin-top: 0;
  }

  dl dt> :last-child {
    margin-bottom: 0;
  }

  dl dd {
    margin: 0 0 15px;
    padding: 0 15px;
  }

  dl dd> :first-child {
    margin-top: 0;
  }

  dl dd> :last-child {
    margin-bottom: 0;
  }

  blockquote {
    @apply px-2 border-l-4 border-gray-300
  }

  table {
    padding: 0;
  }

  table tr {
    border-top: 1px solid #cccccc;
    background-color: white;
    margin: 0;
    padding: 0;
  }

  table tr:nth-child(2n) {
    background-color: #f8f8f8;
  }

  table tr th {
    font-weight: bold;
    border: 1px solid #cccccc;
    text-align: left;
    margin: 0;
    padding: 6px 13px;
  }

  table tr td {
    border: 1px solid #cccccc;
    text-align: left;
    margin: 0;
    padding: 6px 13px;
  }

  table tr th :first-child,
  table tr td :first-child {
    margin-top: 0;
  }

  table tr th :last-child,
  table tr td :last-child {
    margin-bottom: 0;
  }

  img {
    @apply max-w-full mx-auto
  }

  code {
    @apply px-1 mx-1 bg-gray-100 border rounded
  }

  pre {
    @apply px-4 py-2 bg-gray-800 overflow-auto rounded;

    code {
      @apply p-0 m-0 whitespace-pre bg-transparent border-0
    }
  }
}
</style>
