<script setup lang="ts">
interface CatalogItem {
  id: string;
  depth: number;
  text: string;
  children?: CatalogItem[]
}

const props = defineProps<{
  item: CatalogItem
}>()

const toggleAllCatalog = useToggleAllCatalog()
const expand = ref(true)

watch(toggleAllCatalog, () => {
  if (toggleAllCatalog.value === 'expand') {
    expand.value = true
  } else if (toggleAllCatalog.value === 'collapse') {
    expand.value = false
  }
})

const toggleCatalogHandler = () => {
  expand.value = !expand.value
  toggleAllCatalog.value = ''
}

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

const buttonClass = computed(() => {
  let classString = ''

  if (catalogType.value === 'tree') {
    classString += 'order-3 translate-x-[10px]'

    if (!props.item.children) {
      classString += ' ' + 'border-transparent'
      return classString
    }
  } else {
    classString += 'order-2 -translate-x-2.5'
  }

  if (expand.value && props.item.children) {
    classString += ' ' + borderColorMap[props.item.depth].expand + ' ' + bgColorMap[props.item.depth].expand
  } else if (props.item.children) {
    classString += ' ' + borderColorMap[props.item.depth].collapse + ' ' + bgColorMap[props.item.depth].collapseWithChildren
  } else {
    classString += ' ' + borderColorMap[props.item.depth].collapse + ' ' + bgColorMap[props.item.depth].collapse
  }

  return classString
})

const textClass = computed(() => {
  let classString = ''

  if (activeHeadings.value.has(props.item.id)) {
    classString += 'font-bold'
  }

  if (catalogType.value === 'tree') {
    classString += ' ' + 'order-2'
  } else {
    classString += ' ' + 'order-3'
  }

  return classString
})

/**
 *
 * active heading
 *
 */
const activeHeadings = useActiveHeadings()

/**
 *
 * change catalog type to "tree" or "list"
 *
 */
const catalogType = useCatalogType()
</script>

<template>
  <li class="flex" :class="catalogType === 'tree' ? 'flex-row justify-start items-center' : 'flex-col'">
    <div class="shrink-0 flex items-center" :class="catalogType === 'tree' ? 'pl-4 w-32 justify-between' : 'px-2'">
      <div
        class="shrink-0 self-stretch order-1 py-2 flex justify-center items-center border-r"
        :class="catalogType === 'tree' ? 'border-transparent' : (activeHeadings.has(props.item.id) ? `pr-4 ${borderColorMap[props.item.depth].active} border-solid ` : `pr-4 ${borderColorMap[props.item.depth].expand} border-dashed`)"
      >
        <p class="heading-mark text-xs font-thin" :class="`${textColorMap[props.item.depth]}`">
          H{{ props.item.depth }}
        </p>
      </div>

      <button
        class="shrink-0 flex justify-center items-center rounded-full border-[3px]"
        :class="buttonClass"
        :disabled="!props.item.children"
        @click="toggleCatalogHandler"
      >
        <IconCustom
          v-if="props.item.children"
          name="ion:add"
          class="w-3.5 h-3.5 text-white transition-transform duration-500 delay-300"
          :class="expand ? 'rotate-45' : 'rotate-0'"
        />
        <div v-else class="w-3.5 h-3.5" />
      </button>

      <a
        :href="`#${props.item.id}`"
        class="py-2 px-2 text-sm text-gray-800 hover:text-purple-500 hover:bg-purple-100 transition-colors duration-300 rounded"
        :class="textClass"
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
      <ul
        v-if="props.item.children"
        v-show="expand"
        :class="catalogType === 'tree' ? `border-l ${borderColorMap[props.item.depth].expand} space-y-2 rounded-md` : ''"
      >
        <CatalogItem v-for="subItem in props.item.children" :key="subItem.id" :item="subItem" />
      </ul>
    </Transition>
  </li>
</template>

<style scoped>

</style>
