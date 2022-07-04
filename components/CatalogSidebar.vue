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

const showCatalog = useShowCatalog()

const sidebar = ref(null)
// sidebar size and position
const sidebarWidth = ref(300)
const sidebarHeight = ref(300)
const sidebarLeft = ref(16)
const sidebarBottom = ref(16)

const sidebarFloat = useSidebarFloat()
// reset float sidebar size and position
// const resetFloatSidebar = ref(false)

const resetFloatSidebarHandler = () => {
  sidebarWidth.value = 300
  sidebarHeight.value = 300
  sidebarLeft.value = 16
  if (document.documentElement.clientWidth <= 640) {
    sidebarBottom.value = 80
  } else {
    sidebarBottom.value = 16
  }
}

// watch(resetFloatSidebar, () => {
//   if (resetFloatSidebar.value) {
//     resetFloatSidebarHandler()
//   }
//   resetFloatSidebar.value = false
// })

/**
 *
 * set the sidebar init state
 * and auto adjust the sidebar float state when resize window
 *
 */
onMounted(() => {
  const setSidebarWidth = () => {
    sidebarWidth.value = (document.documentElement.clientWidth - 896) / 2
  }

  // base on the page init state to set the sidebar init state
  if (document.documentElement.clientWidth < 1280) {
    // sidebarWidth.value = 300
    // sidebarHeight.value = 300
    // sidebarLeft.value = 16

    // if (document.documentElement.clientWidth < 640) {
    //   sidebarBottom.value = 80
    // } else {
    //   sidebarBottom.value = 16
    // }

    if (document.documentElement.clientWidth <= 640) {
      sidebarBottom.value = 80
    }

    sidebarFloat.value = true
  } else {
    setSidebarWidth()
    // sidebarFloat.value = false
  }

  // listen window resize event
  // and adjust the width of the fixed sidebar (not the float sidebar)
  let resizeTimer = null

  window.onresize = () => {
    if (resizeTimer) {
      clearTimeout(resizeTimer)
    }

    resizeTimer = setTimeout(() => {
      if (document.documentElement.clientWidth < 1280 && sidebarFloat.value === false) {
        // when the window resize smaller than 1280px at the first time
        // and if the sidebar not toggle to float manually

        // reset the size and position of the float catalog
        if (!toggleSidebarFloat.value) {
          resetFloatSidebarHandler()
          resetCatalogListScaleHandler()
        }

        // auto float the catalog
        sidebarFloat.value = true
      } else if (document.documentElement.clientWidth >= 1280 && sidebarFloat.value === true) {
        // when the window resize bigger (or equal) than 1280px at the first time
        // and if the sidebar not toggle to float manually

        // change the float state to fixed
        sidebarFloat.value = false
      }

      // set the fixed sidebar width when window resize
      if (!sidebarFloat.value && !toggleSidebarFloat.value) {
        setSidebarWidth()
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
const toggleSidebarFloat = useToggleSidebarFloat()

onMounted(() => {
  watch(toggleSidebarFloat, () => {
    if (toggleSidebarFloat.value) {
      // when manually change the fixed state to float
      resetFloatSidebarHandler()
      resetCatalogListScaleHandler()
    } else {
      // when change the float state to fixed
      // reset the fixed sidebar width
      sidebarWidth.value = (document.documentElement.clientWidth - 896) / 2
    }
  })
})

// using interactjs package to make float sidebar interactive
// refer to https://interactjs.io/
const catalogListScale = ref(1)
const catalogListTranslateX = ref(0)
const catalogListTranslateY = ref(0)

const resetCatalogListScaleHandler = () => {
  catalogListScale.value = 1
  catalogListTranslateX.value = 0
  catalogListTranslateY.value = 0
}

onMounted(() => {
  // set the float sidebar resizable
  interact('#sidebar')
    .resizable({
      // resize from all edges and corners
      edges: { left: true, right: true, bottom: true, top: true },
      listeners: {
        move (event) {
          if (sidebarFloat.value || toggleSidebarFloat.value) {
            // when the sidebar float
            // if resize the sidebar
            // update the sidebar size
            sidebarWidth.value = event.rect.width
            sidebarHeight.value = event.rect.height

            // because the float sidebar is fixed based on bottom and left
            // when resize the float sidebar from bottom or left edge
            // should adjust bottom or left position at the same time
            sidebarBottom.value -= event.deltaRect.bottom
            sidebarLeft.value += event.deltaRect.left
          }
        }
      },
      modifiers: [
        // keep the edges inside the parent
        interact.modifiers.restrictEdges({
          outer: 'parent'
        }),

        // minimum size restriction
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
          if (sidebarFloat.value || toggleSidebarFloat.value) {
            // const computedStyle = getComputedStyle(sidebar.value)

            // const bottom = (parseFloat(computedStyle.bottom) || 0)
            // const left = (parseFloat(computedStyle.left) || 0)

            sidebarLeft.value += event.dx
            sidebarBottom.value -= event.dy
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

  // set catalog (inside the float sidebar) scalable (touch screen only) and draggable
  function dragMoveListener (event) {
    catalogListTranslateX.value = catalogListTranslateX.value + event.dx
    catalogListTranslateY.value = catalogListTranslateY.value + event.dy
  }

  interact('#catalog-container')
    .gesturable({
      listeners: {
        move (event) {
          if (floatCatalogType.value === 'tree' && (sidebarFloat.value || toggleSidebarFloat.value)) {
            // two finger pinch to zoom
            catalogListScale.value += event.ds
            // two finger can drag to move
            dragMoveListener(event)
          }
        }
      }
    })
    .draggable({
      // one finger or mouse can drag to move
      listeners: {
        move (event) {
          if (floatCatalogType.value === 'tree' && (sidebarFloat.value || toggleSidebarFloat.value)) {
            dragMoveListener(event)
          }
        }
      }
    })
})

// toggle catalog type between "tree" and "list"
const floatCatalogType = useFloatCatalogType()

const toggleFloatCatalogTypeHandler = () => {
  if (floatCatalogType.value === 'tree') {
    floatCatalogType.value = 'list'
  } else if (floatCatalogType.value === 'list') {
    floatCatalogType.value = 'tree'
  }
}

/**
 *
 * scroll the catalog to top or bottom when catalog type is 'list'
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

/**
 *
 * expand or collapse all catalog
 *
 */
// set value to "expand" or "collapse" or ""
const toggleAllCatalog = useToggleAllCatalog()
</script>

<template>
  <aside
    v-show="showCatalog"
    id="sidebar"
    ref="sidebar"
    tabindex="0"
    class="flex flex-col justify-center fixed z-30 select-none"
    :class="sidebarFloat || toggleSidebarFloat ? 'p-2 bg-gray-100/90 backdrop-blur-sm border-[6px] sm:border-2 border-gray-100/90 focus-within:border-gray-200 shadow-md shadow-gray-500 rounded-lg touch-none' : 'max-h-[70vh] pr-2 py-2 top-1/2 right-0 -translate-y-1/2'"
    :style="sidebarFloat || toggleSidebarFloat ? `width: ${sidebarWidth}px; height: ${sidebarHeight}px; left: ${sidebarLeft}px; bottom: ${sidebarBottom}px` : `width: ${sidebarWidth}px`"
  >
    <div v-show="sidebarFloat || toggleSidebarFloat" class="order-1 py-2 flex items-center gap-2">
      <button
        id="sidebar-dragger"
        class="grow p-2 flex justify-center items-center hover:bg-gray-200 rounded transition-colors duration-300 "
      >
        <IconCustom name="system-uicons:drag" class="w-4 h-4" />
      </button>
      <button
        class="shrink-0 p-1 hidden xl:flex justify-center items-center hover:bg-purple-400 text-white transition-colors duration-300 border border-purple-400 bg-purple-500 rounded"
        @click="toggleSidebarFloat = !toggleSidebarFloat"
      >
        <IconCustom name="clarity:window-restore-line" class="w-4 h-4" />
      </button>
    </div>

    <div
      class="sidebar-btn-container shrink-0 py-2 flex items-center gap-2 overflow-x-auto"
      :class="sidebarFloat || toggleSidebarFloat ? 'order-3' : 'order-2'"
    >
      <button
        class="sidebar-btn flex bg-green-100 text-green-400 hover:text-green-500 active:text-white active:bg-green-500 border border-green-400"
        @click="toggleAllCatalog = 'expand'"
      >
        <IconCustom
          name="ic:round-unfold-more"
          class="w-4 h-4"
          :class="floatCatalogType === 'tree' ? 'rotate-90' : ''"
        />
      </button>

      <button
        class="sidebar-btn flex bg-red-100 text-red-400 hover:text-red-500 active:text-white active:bg-red-500 border border-red-400"
        @click="toggleAllCatalog = 'collapse'"
      >
        <IconCustom
          name="ic:round-unfold-less"
          class="w-4 h-4"
          :class="floatCatalogType === 'tree' ? 'rotate-90' : ''"
        />
      </button>

      <button
        v-show="floatCatalogType === 'list'"
        class="sidebar-btn flex bg-purple-100 text-purple-400 hover:text-purple-500 active:text-white active:bg-purple-500 border border-purple-400"
        @click="scrollCatalogTo = 'top'"
      >
        <IconCustom name="material-symbols:vertical-align-top-rounded" class="w-4 h-4" />
      </button>

      <button
        v-show="floatCatalogType === 'list'"
        class="sidebar-btn flex bg-purple-100 text-purple-400 hover:text-purple-500 active:text-white active:bg-purple-500 border border-purple-400"
        @click="scrollCatalogTo = 'bottom'"
      >
        <IconCustom name="material-symbols:vertical-align-bottom-rounded" class="w-4 h-4" />
      </button>

      <button
        v-show="!sidebarFloat && !toggleSidebarFloat"
        class="hidden xl:flex p-1 justify-center items-center rounded transition-colors duration-300 border border-purple-400 bg-purple-100 text-purple-400 hover:text-purple-500"
        @click="toggleSidebarFloat = !toggleSidebarFloat"
      >
        <IconCustom name="clarity:window-restore-line" class="w-4 h-4" />
      </button>

      <button
        v-show="sidebarFloat || toggleSidebarFloat"
        class="sidebar-btn flex border border-purple-400"
        :class="floatCatalogType === 'tree' ? 'bg-purple-500 hover:bg-purple-400 text-white' : 'bg-purple-100 text-purple-400 hover:text-purple-500'"
        @click="toggleFloatCatalogTypeHandler"
      >
        <IconCustom name="icon-park-outline:tree-diagram" class="w-4 h-4" />
      </button>

      <button
        v-show="floatCatalogType === 'tree' && (sidebarFloat || toggleSidebarFloat)"
        class="sidebar-btn hidden sm:flex bg-purple-100 text-purple-400 hover:text-purple-500 active:text-white active:bg-purple-500 border border-purple-400"
        @click="catalogListScale += 0.1"
      >
        <IconCustom name="majesticons:zoom-in-line" class="w-4 h-4" />
      </button>

      <button
        v-show="floatCatalogType === 'tree' && (sidebarFloat || toggleSidebarFloat)"
        class="sidebar-btn hidden sm:flex bg-purple-100 text-purple-400 hover:text-purple-500 active:text-white active:bg-purple-500 border border-purple-400"
        @click="catalogListScale -= 0.1"
      >
        <IconCustom name="majesticons:zoom-out-line" class="w-4 h-4" />
      </button>

      <button
        v-show="floatCatalogType === 'tree' && (sidebarFloat || toggleSidebarFloat)"
        class="sidebar-btn flex bg-purple-100 text-purple-400 hover:text-purple-500 active:text-white active:bg-purple-500 border border-purple-400"
        @click="resetCatalogListScaleHandler"
      >
        <IconCustom name="uil:focus-target" class="w-4 h-4" />
      </button>
    </div>

    <div
      id="catalog-container"
      ref="catalogContainer"
      class="grow w-full flex flex-col scroll-smooth overscroll-none"
      :class="sidebarFloat || toggleSidebarFloat ? (floatCatalogType === 'tree' ? 'order-2 gap-2 overflow-hidden ' : ' order-2 overflow-y-auto') : 'order-3 overflow-y-auto'"
    >
      <ul
        class="shrink-0"
        :class="(sidebarFloat || toggleSidebarFloat) && floatCatalogType === 'tree' ? 'space-y-2 m-4 border-l border-purple-300 rounded-md touch-none' : ''"
        :style="(sidebarFloat || toggleSidebarFloat) && floatCatalogType === 'tree' ? `transform: translate(${catalogListTranslateX}px, ${catalogListTranslateY}px) scale(${catalogListScale})` : ''"
      >
        <CatalogItem v-for="catalog in props.catalogs" :key="catalog.id" :item="catalog" :depth="catalog.depth || 2" />
      </ul>
    </div>
  </aside>
  <!-- eslint-disable-next-line vue/no-multiple-template-root -->
  <button
    v-show="showCatalog && (sidebarFloat || toggleSidebarFloat)"
    class="p-3 sm:p-2 flex justify-center items-center fixed bottom-[8.5rem] sm:bottom-28 right-2 sm:right-4 z-40 bg-purple-100 text-purple-400 hover:text-purple-500 active:text-white active:bg-purple-500 border border-gray-200 rounded-lg"
    @click="resetFloatSidebarHandler"
  >
    <IconCustom name="bi:layout-sidebar-inset" class="w-5 h-5" />
  </button>
</template>

<style scoped lang="scss">

#catalog-container, .sidebar-btn-container {
  &::-webkit-scrollbar {
    display: none;
  }
}
.sidebar-btn {
  @apply p-2 sm:p-1 justify-center items-center transition-colors duration-300 rounded
}
</style>
