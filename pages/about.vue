<script setup lang="ts">

</script>

<template>
  <div>
    <NuxtLayout name="base">
      <ContentDoc class="about-me-content-container">
        <template #not-found>
          <div class="about-me-content-container">
            <h1>
              About
            </h1>
            <p>
              This website is my blog built by <a
                href="https://github.com/Benbinbin/flexiblog-frontend"
                target="_blank"
                class="text-blue-600 font-bold"
              >FlexiBlog</a>.
            </p>
          </div>
        </template>
      </ContentDoc>
    </NuxtLayout>
  </div>
</template>

<style lang="scss">

.about-me-content-container {
  @apply container mx-auto p-8;

  h1 {
    @apply p-8 text-3xl font-bold text-center
  }

  h2 {
    @apply p-8 text-2xl font-bold text-center
  }

  p {
    @apply p-4 text-xl text-gray-500
  }
}
</style>
