<script setup lang="ts">
const clickHandler = () => {
  if (document && document.documentElement && document.documentElement.scrollTop) { document.documentElement.scrollTop = 0 }

  if (document && document.body.scrollTop) { document.body.scrollTop = 0 }
}
</script>

<template>
  <button
    class="p-2 border border-slate-300 text-slate-500 hover:text-slate-600 bg-white hover:bg-slate-100 transition-color duration-300 rounded-lg"
    @click="clickHandler"
  >
    <svg
      class="w-full"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="img"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M18 15a1 1 0 0 1-.64-.23L12 10.29l-5.37 4.32a1 1 0 0 1-1.41-.15a1 1 0 0 1 .15-1.41l6-4.83a1 1 0 0 1 1.27 0l6 5a1 1 0 0 1 .13 1.41A1 1 0 0 1 18 15Z"
      />
    </svg>
  </button>
</template>

<style scoped>
</style>
