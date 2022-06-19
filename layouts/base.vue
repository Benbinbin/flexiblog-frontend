<script setup lang="ts">
/**
 * listen page scroll
 */
const isShowBackBtn = ref(false)
let timer
onMounted(() => {
  if (document) {
    const scrollDistanceInit = document.body.scrollTop || document.documentElement.scrollTop
    if (scrollDistanceInit > 600) { isShowBackBtn.value = true }
    document.addEventListener('scroll', () => {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      timer = setTimeout(() => {
        const scrollDistance = document.body.scrollTop || document.documentElement.scrollTop
        if (scrollDistance > 600) {
          isShowBackBtn.value = true
        } else {
          isShowBackBtn.value = false
        }
        timer = null
      }, 100)
    })
  }
})
</script>

<template>
  <div class="bg-gray-50 flex flex-col min-h-screen">
    <Head>
      <Style type="text/css" children="html, body { scroll-behavior: smooth;}" />
    </Head>

    <NavBar class="sm:sticky top-0 inset-x-0 z-50 bg-gray-50" />
    <div class="flex-grow">
      <slot />
    </div>
    <hr class="p-4 w-1/5 mx-auto">
    <FooterContent />

    <Transition
      enter-from-class="transform translate-y-36 md:translate-y-10 opacity-0"
      enter-active-class="transition-all duration-300 ease"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-active-class="transition-all duration-75 ease"
      leave-to-class="transform translate-y-36 md:translate-y-10 opacity-0"
    >
      <BackToTop v-show="isShowBackBtn" class="w-10 h-10 fixed z-20 bottom-20 sm:bottom-4 right-2" />
    </Transition>
  </div>
</template>

<style lang="scss">

// a {
//   @apply text-purple-400 underline decoration-2 decoration-transparent hover:decoration-purple-400;
// }

::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: rgba(156, 163, 175, 1);
  border: 3px solid transparent;
  background-clip: padding-box;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(107, 114, 128, 1);
}
</style>
