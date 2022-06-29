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

const toggleExpandAllCatalog = useToggleExpandAllCatalog()
const expand = ref(true)

watch(toggleExpandAllCatalog, () => {
  if (toggleExpandAllCatalog.value) {
    expand.value = true
  } else if (!toggleExpandAllCatalog.value) {
    expand.value = false
  }
})

const bgColorMap = {
  2: {
    expand: 'bg-purple-500',
    collapse: 'bg-purple-200',
    collapseWithChildren: 'bg-purple-400'
  },
  3: {
    expand: 'bg-red-500',
    collapse: 'bg-red-200',
    collapseWithChildren: 'bg-red-400'
  },
  4: {
    expand: 'bg-green-500',
    collapse: 'bg-green-200',
    collapseWithChildren: 'bg-green-400'
  },
  5: {
    expand: 'bg-blue-500',
    collapse: 'bg-blue-200',
    collapseWithChildren: 'bg-blue-400'
  },
  6: {
    expand: 'bg-gray-500',
    collapse: 'bg-gray-200',
    collapseWithChildren: 'bg-gray-400'
  }
}

const textColorMap = {
  2: 'text-purple-400',
  3: 'text-red-400',
  4: 'text-green-400',
  5: 'text-blue-400',
  6: 'text-gray-400'
}

const borderColorMap = {
  2: { active: 'border-purple-500', expand: 'border-purple-300', collapse: 'border-purple-100' },
  3: { active: 'border-red-500', expand: 'border-red-300', collapse: 'border-red-100' },
  4: { active: 'border-green-500', expand: 'border-green-300', collapse: 'border-green-100' },
  5: { active: 'border-blue-500', expand: 'border-blue-300', collapse: 'border-blue-100' },
  6: { active: 'border-gray-500', expand: 'border-gray-300', collapse: 'border-gray-100' }
}

/**
 *
 * active heading
 *
 */
const activeHeadings = useActiveHeadings()
</script>

<template>
  <li>
    <div class="px-2 flex items-center">
      <div
        class="shrink-0 self-stretch py-2 pr-4 flex justify-center items-center border-r"
        :class="activeHeadings.has(props.item.id) ? `${borderColorMap[props.depth].active} border-solid` : `${borderColorMap[props.depth].expand} border-dashed`"
      >
        <p class="heading-mark text-xs font-thin" :class="`${textColorMap[props.depth]}`">
          H{{ props.item.depth || props.depth }}
        </p>
      </div>

      <button
        class="shrink-0 flex justify-center items-center rounded-full border-[3px] -translate-x-2.5"
        :class="(expand && props.item.children) ? `${borderColorMap[props.depth].expand} ${bgColorMap[props.depth].expand}` : (props.item.children ? `${borderColorMap[props.depth].collapse} ${bgColorMap[props.depth].collapseWithChildren}` : `${borderColorMap[props.depth].collapse} ${bgColorMap[props.depth].collapse}`)"
        :disabled="!props.item.children"
        @click="expand = !expand"
      >
        <IconCustom
          v-if="props.item.children"
          name="ion:add"
          class="w-3.5 h-3.5 text-white transition-transform duration-500 delay-300"
          :class="expand ? 'rotate-45' : 'rotate-0'"
        />
        <div v-if="!props.item.children" class="w-3.5 h-3.5" />
      </button>

      <a
        :href="`#${props.item.id}`"
        class="py-2 px-2 text-sm text-gray-800 hover:text-purple-500 hover:bg-purple-100 transition-colors duration-300 rounded"
        :class="activeHeadings.has(props.item.id) ? 'font-bold' : ''"
      >{{
        props.item.text }}</a>
    </div>

    <Transition
      enter-from-class="translate-x-10 opacity-0"
      enter-active-class="transition-all duration-300 ease-in-out"
      enter-to-class="translate-x-0 opacity-100"
      leave-from-class="translate-x-0 opacity-100"
      leave-active-class="transition-all duration-100 ease-out"
      leave-to-class="translate-x-10 opacity-0"
    >
      <ul v-if="props.item.children" v-show="expand">
        <CatalogItem
          v-for="subItem in props.item.children"
          :key="subItem.id"
          :item="subItem"
          :depth="subItem.depth || props.depth+1"
        />
      </ul>
    </Transition>
  </li>
</template>

<style scoped>

</style>
