<script setup lang="ts">
import interact from 'interactjs'

interface CatalogItem {
  id: string;
  depth: number;
  text: string;
  children?: CatalogItem[]
}

const props = defineProps<{
  catalogs: CatalogItem[]
}>()

const sidebar = ref(null)
const sidebarWidth = ref(0)

/**
 *
 * expand or collapse all catalog
 *
 */
// set value to "expand" or "collapse" or ""
const toggleAllCatalog = useToggleAllCatalog()

/**
 *
 * set the catalog init state
 * auto adjust the catalog float state when resize window
 *
 */
const catalogFloat = ref(false)
onMounted(() => {
  const setCatalogWidth = () => {
    sidebarWidth.value = (document.documentElement.clientWidth - 896) / 2
  }

  // catalog init state
  if (document.documentElement.clientWidth < 1280) {
    sidebarWidth.value = 200
    catalogFloat.value = true
  } else {
    catalogFloat.value = false
    setCatalogWidth()
  }

  let resizeTimer = null

  window.onresize = () => {
    if (resizeTimer) {
      clearTimeout(resizeTimer)
    }

    resizeTimer = setTimeout(() => {
      if (document.documentElement.clientWidth < 1280 && catalogFloat.value === false) {
        if (!toggleCatalogFloat.value) {
          sidebarWidth.value = 200
        }
        catalogFloat.value = true
      } else if (document.documentElement.clientWidth >= 1280) {
        catalogFloat.value = false
      }

      if (!catalogFloat.value && !toggleCatalogFloat.value) {
        setCatalogWidth()
      }

      resizeTimer = null
    }, 300)
  }
})

/**
 *
 * manual toggle catalog float state
 *
 */

const toggleCatalogFloat = ref(false)
const resetFloatCatalogPosition = ref(false)

onMounted(() => {
  watch(toggleCatalogFloat, () => {
    if (!toggleCatalogFloat.value) {
      catalogFloat.value = false
      catalogType.value = 'list'
      sidebarWidth.value = (document.documentElement.clientWidth - 896) / 2
      sidebar.value.style.cssText = `width: ${sidebarWidth.value}px`
    }
  })

  watch(resetFloatCatalogPosition, () => {
    if (resetFloatCatalogPosition.value) {
      sidebar.value.style.width = '200px'
      sidebar.value.style.height = '70vh'
      sidebar.value.style.left = '16px'
      if (document.documentElement.clientWidth < 640) {
        sidebar.value.style.bottom = '80px'
      } else {
        sidebar.value.style.bottom = '16px'
      }

      resetFloatCatalogPosition.value = false
    }
  })
})

// enable the float catalog drag and resize feature
// using interactjs package
// refer to https://interactjs.io/
onMounted(() => {
  // set the sidebar resizable
  interact('#sidebar-nav')
    .resizable({
      // resize from all edges and corners
      edges: { left: true, right: true, bottom: true, top: true },
      listeners: {
        move (event) {
          if (catalogFloat.value || toggleCatalogFloat.value) {
            const target = event.target
            const computedStyle = getComputedStyle(target)

            let bottom = (parseFloat(computedStyle.bottom) || 0)
            let left = (parseFloat(computedStyle.left) || 0)

            // update the element's style
            target.style.width = event.rect.width + 'px'
            target.style.height = event.rect.height + 'px'

            // adjust bottom or left position when resizing from bottom or left edges
            bottom -= event.deltaRect.bottom
            left += event.deltaRect.left

            target.style.bottom = bottom + 'px'
            target.style.left = left + 'px'
          }
        }
      },
      modifiers: [
        // keep the edges inside the parent
        interact.modifiers.restrictEdges({
          outer: 'parent'
        }),

        // minimum size
        interact.modifiers.restrictSize({
          min: { width: 200, height: 200 }
        })
      ],
      inertia: true
    })

  // set sidebar draggable
  interact('#sidebar-dragger')
    .draggable({
      listeners: {
        move (event) {
          if ((catalogFloat || toggleCatalogFloat) && sidebar.value) {
            const computedStyle = getComputedStyle(sidebar.value)

            const bottom = (parseFloat(computedStyle.bottom) || 0)
            const left = (parseFloat(computedStyle.left) || 0)

            sidebar.value.style.left = left + event.dx + 'px'
            sidebar.value.style.bottom = bottom - event.dy + 'px'
          }
        }
      },
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: 'body',
          endOnly: true
        })
      ],
      inertia: true
    })

  // set sidebar scalable (touch screen only)
})

// change catalog type to "tree" or "list"
const catalogType = useCatalogType()

const toggleCatalogType = () => {
  if (catalogType.value === 'tree') {
    catalogType.value = 'list'
  } else if (catalogType.value === 'list') {
    catalogType.value = 'tree'
  }
}

/**
 *
 * scroll the catalog to top or bottom
 */
const catalogContainer = ref(null)
const scrollCatalogTo = ref('')
onMounted(() => {
  watch(scrollCatalogTo, () => {
    if (scrollCatalogTo.value === 'top') {
      catalogContainer.value.scrollTop = 0
    } else if (scrollCatalogTo.value === 'bottom') {
      catalogContainer.value.scrollTop = catalogContainer.value.scrollHeight - catalogContainer.value.clientHeight
    }
    scrollCatalogTo.value = ''
  })
})
</script>

<template>
  <aside
    id="sidebar-nav"
    ref="sidebar"
    class="flex flex-col justify-center fixed z-30 select-none"
    :class="catalogFloat || toggleCatalogFloat ? 'h-[70vh] p-2 bg-gray-100/90 backdrop-blur-sm bottom-20 sm:bottom-4 left-4 border-[6px] sm:border-2 border-gray-100/90 focus-within:border-gray-200 shadow-md shadow-gray-500 rounded-lg touch-none' : 'max-h-[70vh] pr-2 py-2 top-1/2 right-0 -translate-y-1/2'"
    :style="`width: ${sidebarWidth}px`"
    tabindex="0"
  >
    <div v-show="catalogFloat || toggleCatalogFloat" class="order-1 py-2 flex items-center gap-2">
      <button
        id="sidebar-dragger"
        class="grow p-2 flex justify-center items-center hover:bg-gray-200 rounded transition-colors duration-300 "
      >
        <IconCustom name="system-uicons:drag" class="w-4 h-4" />
      </button>
      <button
        class="shrink-0 p-1 hidden xl:flex justify-center items-center hover:bg-purple-400 text-white transition-colors duration-300 border border-purple-400 bg-purple-500 rounded"
        @click="toggleCatalogFloat = !toggleCatalogFloat"
      >
        <IconCustom name="clarity:window-restore-line" class="w-4 h-4" />
      </button>
      <!-- <button
        class="p-2 sm:p-1 flex xl:hidden justify-center items-center rounded transition-colors duration-300 border border-purple-400"
        :class="catalogType === 'tree' ? 'bg-purple-500 hover:bg-purple-400 text-white' : 'bg-purple-100 text-purple-400 hover:text-purple-500'"
        @click="toggleCatalogType"
      >
        <IconCustom name="icon-park-outline:tree-diagram" class="w-4 h-4" />
      </button> -->
    </div>

    <div
      class="sidebar-btn-container shrink-0 py-2 flex items-center gap-2 overflow-x-auto"
      :class="catalogFloat || toggleCatalogFloat ? 'order-3' : 'order-2'"
    >
      <button
        class="sidebar-btn bg-green-100 text-green-400 hover:text-green-500 active:text-white active:bg-green-500 border border-green-400"
        @click="toggleAllCatalog = 'expand'"
      >
        <IconCustom name="ic:round-unfold-more" class="w-4 h-4" />
      </button>

      <button
        class="sidebar-btn bg-red-100 text-red-400 hover:text-red-500 active:text-white active:bg-red-500 border border-red-400"
        @click="toggleAllCatalog = 'collapse'"
      >
        <IconCustom name="ic:round-unfold-less" class="w-4 h-4" />
      </button>

      <button
        class="sidebar-btn bg-purple-100 text-purple-400 hover:text-purple-500 active:text-white active:bg-purple-500 border border-purple-400"
        @click="scrollCatalogTo = 'top'"
      >
        <IconCustom name="material-symbols:vertical-align-top-rounded" class="w-4 h-4" />
      </button>

      <button
        class="sidebar-btn bg-purple-100 text-purple-400 hover:text-purple-500 active:text-white active:bg-purple-500 border border-purple-400"
        @click="scrollCatalogTo = 'bottom'"
      >
        <IconCustom name="material-symbols:vertical-align-bottom-rounded" class="w-4 h-4" />
      </button>

      <button
        v-show="!catalogFloat && !toggleCatalogFloat"
        class="hidden xl:flex p-1 justify-center items-center rounded transition-colors duration-300 border border-purple-400 bg-purple-100 text-purple-400 hover:text-purple-500"
        @click="toggleCatalogFloat = !toggleCatalogFloat"
      >
        <IconCustom name="clarity:window-restore-line" class="w-4 h-4" />
      </button>

      <button
        v-show="catalogFloat || toggleCatalogFloat"
        class="sidebar-btn border border-purple-400"
        :class="catalogType === 'tree' ? 'bg-purple-500 hover:bg-purple-400 text-white' : 'bg-purple-100 text-purple-400 hover:text-purple-500'"
        @click="toggleCatalogType"
      >
        <IconCustom name="icon-park-outline:tree-diagram" class="w-4 h-4" />
      </button>
    </div>

    <div
      ref="catalogContainer"
      class="catalog-container grow w-full flex overflow-y-auto overscroll-none scroll-smooth"
      :class="catalogFloat || toggleCatalogFloat ? (catalogType === 'tree' ? ' justify-start items-start order-2 gap-2 overflow-x-auto' :'flex-col justify-start order-2') : 'flex-col order-3 justify-start'"
    >
      <ul class="shrink-0" :class="catalogType === 'tree' ? 'space-y-2 p-4' : ''">
        <CatalogItem v-for="catalog in props.catalogs" :key="catalog.id" :item="catalog" :depth="catalog.depth || 2" />
      </ul>
    </div>
  </aside>
  <!-- eslint-disable-next-line vue/no-multiple-template-root -->
  <button
    v-show="catalogFloat || toggleCatalogFloat"
    class="p-3 sm:p-2 flex justify-center items-center fixed bottom-[8.5rem] xl:bottom-28 right-2 sm:right-4 z-40 bg-purple-100 text-purple-400 hover:text-purple-500 active:text-white active:bg-purple-500 border border-gray-200 rounded-lg"
    @click="resetFloatCatalogPosition = true"
  >
    <IconCustom name="bi:layout-sidebar-inset" class="w-5 h-5" />
  </button>
</template>

<style scoped lang="scss">

.catalog-container, .sidebar-btn-container {
  &::-webkit-scrollbar {
    display: none;
  }
}
.sidebar-btn {
  @apply p-2 sm:p-1 flex justify-center items-center transition-colors duration-300 rounded
}
</style>
