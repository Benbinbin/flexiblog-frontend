<script setup lang="ts">
interface CatalogItem {
  id: string;
  depth: number;
  text: string;
  children?: CatalogItem[]
}

const props = defineProps<{
  item: CatalogItem,
  depth?: number
}>()

const expand = ref(false)

const bgColorMap = {
  2: 'bg-purple-400',
  3: 'bg-red-400',
  4: 'bg-green-400',
  5: 'bg-blue-400',
  6: 'bg-gray-400'
}

const textColorMap = {
  2: 'text-purple-400',
  3: 'text-red-400',
  4: 'text-green-400',
  5: 'text-blue-400',
  6: 'text-gray-400'
}

const borderColorMap = {
  2: { active: 'border-purple-300', inactive: 'border-purple-100' },
  3: { active: 'border-red-300', inactive: 'border-red-100' },
  4: { active: 'border-green-300', inactive: 'border-green-100' },
  5: { active: 'border-blue-300', inactive: 'border-blue-100' },
  6: { active: 'border-gray-300', inactive: 'border-gray-100' }
}
</script>

<template>
  <li>
    <div class="px-2 flex items-center">
      <div
        class="shrink-0 self-stretch py-2 pr-4 flex justify-center items-center border-r border-dashed"
        :class="`${borderColorMap[props.depth].active}`"
      >
        <p class="heading-mark text-xs font-thin" :class="`${textColorMap[props.depth]}`">
          H{{ props.item.depth || props.depth }}
        </p>
      </div>

      <button
        class="shrink-0 w-4 h-4 rounded-full border-4 disabled:opacity-30 -translate-x-2"
        :class="(expand && props.item.children) ? `${borderColorMap[props.depth].active} ${bgColorMap[props.depth]}` : `${borderColorMap[props.depth].inactive} ${bgColorMap[props.depth]}`"
        :disabled="!props.item.children"
        @click="expand = !expand"
      />
      <a
        :href="`#${props.item.id}`"
        class="py-2 px-2 text-sm text-gray-800 hover:text-purple-500 hover:bg-purple-100 transition-colors duration-300 rounded"
      >{{
        props.item.text }}</a>
    </div>

    <ul v-if="expand && props.item.children">
      <CatalogItem
        v-for="subItem in props.item.children"
        :key="subItem.id"
        :item="subItem"
        :depth="subItem.depth || props.depth+1"
      />
    </ul>
  </li>
</template>

<style scoped>

</style>
