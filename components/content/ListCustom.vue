<script setup lang="ts">
// Utils from Nuxt Content
const { flatUnwrap } = useUnwrap()

defineProps({
  icon: {
    type: String,
    default: 'heroicons-outline:badge-check'
  }
})
</script>

<template>
  <ul class="p-0">
    <li v-for="(item, index) of flatUnwrap($slots.default(), ['ul'])" :key="index" class="flex space-x-2">
      <IconCustom :name="icon" class="flex-shrink-0 w-6 h-6 mt-1 text-emerald-500" />
      <span><Markdown :use="() => item" unwrap="li" /></span>
    </li>
  </ul>
</template>
