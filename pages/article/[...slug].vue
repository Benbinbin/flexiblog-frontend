<script setup lang="ts">
// const route = useRoute()

// console.log(route)

// let articleQueryParams

// if (Array.isArray(route.params.slug)) {
//   articleQueryParams = route.params.slug.join('/')
// } else {
//   articleQueryParams = [route.params.slug]
// }

// const { data: article } = await useAsyncData('article', () => queryContent(articleQueryParams).findOne())

// console.log(article)
</script>

<template>
  <div>
    <!-- <ContentRenderer :value="article">
      <template #not-found>
        <p>There is no such articles found.</p>
      </template>
    </ContentRenderer> -->
    <NuxtLayout name="base">
      <ContentDoc />
    </NuxtLayout>
  </div>
</template>

<style scoped>
</style>
