<script setup lang="ts">
// import interact from 'interactjs'

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
      sidebarFloat.value = true
    } else {
      // when change the float state to fixed
      // reset the fixed sidebar width
      sidebarWidth.value = (document.documentElement.clientWidth - 896) / 2
      sidebarFloat.value = false
    }
  })
})

/**
 *
 * resize the float sidebar
 *
 */
let currentResizePointer = null
let startResizePointer = null
let startSidebarWidth = 0
let startSidebarHeight = 0
let startLeft = 0
let startBottom = 0
type ResizeDirectionType = 'up' | 'bottom' | 'left' | 'right' | 'up-left' | 'up-right' | 'bottom-left' | 'bottom-right' | ''
const resizeDirection = ref <ResizeDirectionType>('')
const resizePointerDownHandler = (direction, event) => {
  if (event) {
    event.currentTarget.setPointerCapture(event.pointerId)
    currentResizePointer = event
    startResizePointer = event
    resizeDirection.value = direction
    startSidebarWidth = sidebarWidth.value
    startSidebarHeight = sidebarHeight.value
    startLeft = sidebarLeft.value
    startBottom = sidebarBottom.value
  }
}

const resizePointerMoveHandler = (event) => {
  if (event && startResizePointer) {
    currentResizePointer = event

    // when pointer move resize the sidebar
    // because the float sidebar is fixed based on bottom and left
    // when resize the float sidebar from bottom
    // should adjust bottom position at the same time
    if (resizeDirection.value !== 'left' && resizeDirection.value !== 'right') {
      const distance = currentResizePointer.y - startResizePointer.y

      if (resizeDirection.value === 'up' || resizeDirection.value === 'up-left' || resizeDirection.value === 'up-right') {
        sidebarHeight.value = startSidebarHeight - distance
      } else {
        sidebarHeight.value = startSidebarHeight + distance
        sidebarBottom.value = startBottom - distance
      }
    }

    if (resizeDirection.value !== 'up' && resizeDirection.value !== 'bottom') {
      const distance = currentResizePointer.x - startResizePointer.x

      if (resizeDirection.value === 'left' || resizeDirection.value === 'up-left' || resizeDirection.value === 'bottom-left') {
        sidebarWidth.value = startSidebarWidth - distance
        sidebarLeft.value = startLeft + distance
      } else {
        sidebarWidth.value = startSidebarWidth + distance
      }
    }
  }
}

const resizePointerCancelHandler = () => {
  currentResizePointer = null
  startResizePointer = null
  resizeDirection.value = ''
  startSidebarWidth = 0
  startSidebarHeight = 0
}

/**
 *
 * move the float sidebar
 *
 */
let currentDragPointer = null
let startDragPointer = null
const dragState = ref(false)
const dragPointerDownHandler = (event) => {
  if (event) {
    dragState.value = true

    event.currentTarget.setPointerCapture(event.pointerId)
    currentDragPointer = event
    startDragPointer = event

    startLeft = sidebarLeft.value
    startBottom = sidebarBottom.value
  }
}

const dragPointerMoveHandler = (event) => {
  if (event && startDragPointer) {
    currentDragPointer = event

    const dx = currentDragPointer.x - startDragPointer.x
    const dy = currentDragPointer.y - startDragPointer.y

    sidebarLeft.value = startLeft + dx
    sidebarBottom.value = startBottom - dy
  }
}

const dragPointerCancelHandler = () => {
  dragState.value = false
  currentDragPointer = null
  startDragPointer = null
}

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
  // interact('#sidebar')
  //   .resizable({
  //     // resize from all edges and corners
  //     edges: { left: true, right: true, bottom: true, top: true },
  //     listeners: {
  //       move (event) {
  //         if (sidebarFloat.value || toggleSidebarFloat.value) {
  //           // when the sidebar float
  //           // if resize the sidebar
  //           // update the sidebar size
  //           sidebarWidth.value = event.rect.width
  //           sidebarHeight.value = event.rect.height

  //           // because the float sidebar is fixed based on bottom and left
  //           // when resize the float sidebar from bottom or left edge
  //           // should adjust bottom or left position at the same time
  //           sidebarBottom.value -= event.deltaRect.bottom
  //           sidebarLeft.value += event.deltaRect.left
  //         }
  //       }
  //     },
  //     modifiers: [
  //       // keep the edges inside the parent
  //       interact.modifiers.restrictEdges({
  //         outer: 'parent'
  //       }),

  //       // minimum size restriction
  //       interact.modifiers.restrictSize({
  //         min: { width: 200, height: 200 }
  //       })
  //     ],
  //     inertia: true
  //   })

  // set sidebar draggable
  // interact('#sidebar-dragger')
  //   .draggable({
  //     listeners: {
  //       move (event) {
  //         if (sidebarFloat.value || toggleSidebarFloat.value) {
  //           sidebarLeft.value += event.dx
  //           sidebarBottom.value -= event.dy
  //         }
  //       }
  //     },
  //     modifiers: [
  //       interact.modifiers.restrictRect({
  //         restriction: 'body',
  //         endOnly: true
  //       })
  //     ],
  //     inertia: true
  //   })

  // set catalog (inside the float sidebar) scalable (touch screen only) and draggable
  // function dragMoveListener (event) {
  //   catalogListTranslateX.value = catalogListTranslateX.value + event.dx
  //   catalogListTranslateY.value = catalogListTranslateY.value + event.dy
  // }

  // interact('#catalog-container')
  //   .gesturable({
  //     listeners: {
  //       move (event) {
  //         if (floatCatalogType.value === 'tree' && (sidebarFloat.value || toggleSidebarFloat.value)) {
  //           // two finger pinch to zoom
  //           catalogListScale.value += event.ds
  //           // two finger can drag to move
  //           dragMoveListener(event)
  //         }
  //       }
  //     }
  //   })
  //   .draggable({
  //     // one finger or mouse can drag to move
  //     listeners: {
  //       move (event) {
  //         if (floatCatalogType.value === 'tree' && (sidebarFloat.value || toggleSidebarFloat.value)) {
  //           dragMoveListener(event)
  //         }
  //       }
  //     }
  //   })
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
    class="flex flex-col justify-center fixed z-30 select-none will-change-transform"
    :class="sidebarFloat ? 'bg-gray-100/90 backdrop-blur-sm shadow-md shadow-gray-500 rounded-lg touch-none' : 'top-1/2 right-0 -translate-y-1/2'"
    :style="sidebarFloat ? `left: ${sidebarLeft}px; bottom: ${sidebarBottom}px` : ''"
  >
    <div v-show="sidebarFloat" class="flex">
      <button
        draggable="false"
        class="shrink-0 group pt-1 pl-1 flex justify-start items-start cursor-nwse-resize touch-none rounded-tl-lg"
        :class="resizeDirection === 'up' || resizeDirection === 'up-left' || resizeDirection === 'up-right' || resizeDirection === 'bottom-left' || resizeDirection === 'left' ? 'bg-purple-200' : ''"
        @pointerdown="resizePointerDownHandler('up-left', $event)"
        @pointermove="resizePointerMoveHandler"
        @pointercancel="resizePointerCancelHandler"
        @pointerup="resizePointerCancelHandler"
      >
        <div
          class="resize-btn-indicator w-1 h-2 rounded-b"
          :class="resizeDirection === 'up-left' ? 'bg-purple-400': 'bg-gray-400'"
        />
        <div
          class="resize-btn-indicator w-1 h-1 rounded-r"
          :class="resizeDirection === 'up-left' ? 'bg-purple-400': 'bg-gray-400'"
        />
      </button>
      <button
        draggable="false"
        class="grow group py-1 flex justify-center items-start cursor-ns-resize touch-none"
        :class="resizeDirection === 'up' || resizeDirection === 'up-left' || resizeDirection === 'up-right' ? 'bg-purple-200' : ''"
        @pointerdown="resizePointerDownHandler('up', $event)"
        @pointermove="resizePointerMoveHandler"
        @pointercancel="resizePointerCancelHandler"
        @pointerup="resizePointerCancelHandler"
      >
        <div
          class="resize-btn-indicator w-10 h-1 rounded"
          :class="resizeDirection === 'up' ? 'bg-purple-400': 'bg-gray-400'"
        />
      </button>
      <button
        draggable="false"
        class="shrink-0 group pt-1 pr-1 flex justify-end items-start cursor-nesw-resize touch-none rounded-tr-lg"
        :class="resizeDirection === 'up' || resizeDirection === 'up-left' || resizeDirection === 'up-right' || resizeDirection === 'bottom-right' || resizeDirection === 'right' ? 'bg-purple-200' : ''"
        @pointerdown="resizePointerDownHandler('up-right', $event)"
        @pointermove="resizePointerMoveHandler"
        @pointercancel="resizePointerCancelHandler"
        @pointerup="resizePointerCancelHandler"
      >
        <div
          class="resize-btn-indicator w-1 h-1 rounded-l"
          :class="resizeDirection === 'up-right' ? 'bg-purple-400': 'bg-gray-400'"
        />
        <div
          class="resize-btn-indicator w-1 h-2 rounded-b"
          :class="resizeDirection === 'up-right' ? 'bg-purple-400': 'bg-gray-400'"
        />
      </button>
    </div>

    <div class="flex items-stretch">
      <button
        v-show="sidebarFloat"
        draggable="false"
        class="shrink-0 group cursor-ew-resize px-1 flex justify-start items-center touch-none"
        :class="resizeDirection === 'up-left' || resizeDirection === 'left' || resizeDirection === 'bottom-left' ? 'bg-purple-200' : ''"
        @pointerdown="resizePointerDownHandler('left', $event)"
        @pointermove="resizePointerMoveHandler"
        @pointercancel="resizePointerCancelHandler"
        @pointerup="resizePointerCancelHandler"
      >
        <div
          class="resize-btn-indicator w-1 h-10 rounded"
          :class="resizeDirection === 'left' ? 'bg-purple-400': 'bg-gray-400'"
        />
      </button>
      <div
        class="grow flex flex-col justify-start"
        :class="sidebarFloat ? '' : 'max-h-[70vh] pr-2 py-2 '"
        :style="sidebarFloat ? `width: ${sidebarWidth}px; height: ${sidebarHeight}px;` : `width: ${sidebarWidth}px`"
      >
        <button
          v-show="sidebarFloat"
          draggable="false"
          class="shrink-0 order-1 group p-1 w-full flex justify-center items-center rounded transition-colors duration-300 cursor-move touch-none"
          :class="dragState ? 'bg-purple-200 text-purple-800' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'"
          @pointerdown="dragPointerDownHandler"
          @pointermove="dragPointerMoveHandler"
          @pointercancel="dragPointerCancelHandler"
          @pointerup="dragPointerCancelHandler"
        >
          <IconCustom name="system-uicons:drag" class="w-4 h-4" />
        </button>

        <div
          class="sidebar-btn-container shrink-0 py-2 flex items-center gap-2 overflow-x-auto"
          :class="sidebarFloat ? 'justify-between order-3' : 'justify-start order-2'"
        >
          <div class="flex items-center gap-2">
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
              v-show="!sidebarFloat || floatCatalogType === 'list'"
              class="sidebar-btn flex bg-purple-100 text-purple-400 hover:text-purple-500 active:text-white active:bg-purple-500 border border-purple-400"
              @click="scrollCatalogTo = 'top'"
            >
              <IconCustom name="material-symbols:vertical-align-top-rounded" class="w-4 h-4" />
            </button>

            <button
              v-show="!sidebarFloat || floatCatalogType === 'list'"
              class="sidebar-btn flex bg-purple-100 text-purple-400 hover:text-purple-500 active:text-white active:bg-purple-500 border border-purple-400"
              @click="scrollCatalogTo = 'bottom'"
            >
              <IconCustom name="material-symbols:vertical-align-bottom-rounded" class="w-4 h-4" />
            </button>

            <button
              v-show="sidebarFloat"
              class="sidebar-btn flex border border-purple-400"
              :class="floatCatalogType === 'tree' ? 'bg-purple-500 hover:bg-purple-400 text-white' : 'bg-purple-100 text-purple-400 hover:text-purple-500'"
              @click="toggleFloatCatalogTypeHandler"
            >
              <IconCustom name="icon-park-outline:tree-diagram" class="w-4 h-4" />
            </button>

            <button
              v-show="floatCatalogType === 'tree' && sidebarFloat"
              class="sidebar-btn hidden sm:flex bg-purple-100 text-purple-400 hover:text-purple-500 active:text-white active:bg-purple-500 border border-purple-400"
              @click="catalogListScale += 0.1"
            >
              <IconCustom name="majesticons:zoom-in-line" class="w-4 h-4" />
            </button>

            <button
              v-show="floatCatalogType === 'tree' && sidebarFloat"
              class="sidebar-btn hidden sm:flex bg-purple-100 text-purple-400 hover:text-purple-500 active:text-white active:bg-purple-500 border border-purple-400"
              @click="catalogListScale -= 0.1"
            >
              <IconCustom name="majesticons:zoom-out-line" class="w-4 h-4" />
            </button>

            <button
              v-show="floatCatalogType === 'tree' && sidebarFloat"
              class="sidebar-btn flex bg-purple-100 text-purple-400 hover:text-purple-500 active:text-white active:bg-purple-500 border border-purple-400"
              @click="resetCatalogListScaleHandler"
            >
              <IconCustom name="uil:focus-target" class="w-4 h-4" />
            </button>
          </div>

          <button
            class="shrink-0 hidden xl:flex p-1 justify-center items-center rounded border border-purple-400 transition-colors duration-300"
            :class="sidebarFloat ? 'bg-purple-500 hover:bg-purple-400 text-white':'bg-purple-100 text-purple-400 hover:text-purple-500'"
            @click="toggleSidebarFloat = !toggleSidebarFloat"
          >
            <IconCustom name="clarity:window-restore-line" class="w-4 h-4" />
          </button>
        </div>

        <div
          id="catalog-container"
          ref="catalogContainer"
          class="grow w-full flex flex-col scroll-smooth overscroll-none"
          :class="sidebarFloat ? (floatCatalogType === 'tree' ? 'order-2 gap-2 overflow-hidden ' : ' order-2 overflow-y-auto') : 'order-3 overflow-y-auto'"
        >
          <ul
            class="shrink-0"
            :class="sidebarFloat && floatCatalogType === 'tree' ? 'space-y-2 m-4 border-l border-purple-300 rounded-md touch-none' : ''"
            :style="sidebarFloat && floatCatalogType === 'tree' ? `transform: translate(${catalogListTranslateX}px, ${catalogListTranslateY}px) scale(${catalogListScale})` : ''"
          >
            <CatalogItem
              v-for="catalog in props.catalogs"
              :key="catalog.id"
              :item="catalog"
              :depth="catalog.depth || 2"
            />
          </ul>
        </div>
      </div>
      <button
        v-show="sidebarFloat"
        draggable="false"
        class="shrink-0 group px-1 flex justify-end items-center cursor-ew-resize touch-none"
        :class="resizeDirection === 'up-right' || resizeDirection === 'right' || resizeDirection === 'bottom-right' ? 'bg-purple-200' : ''"
        @pointerdown="resizePointerDownHandler('right', $event)"
        @pointermove="resizePointerMoveHandler"
        @pointercancel="resizePointerCancelHandler"
        @pointerup="resizePointerCancelHandler"
      >
        <div
          class="resize-btn-indicator w-1 h-10 rounded"
          :class="resizeDirection === 'right' ? 'bg-purple-400': 'bg-gray-400'"
        />
      </button>
    </div>

    <div v-show="sidebarFloat" class="flex">
      <button
        draggable="false"
        class="shrink-0 group pl-1 pb-1 flex justify-start items-end cursor-nesw-resize touch-none rounded-bl-lg"
        :class="resizeDirection === 'bottom' || resizeDirection === 'bottom-left' || resizeDirection === 'bottom-right' || resizeDirection === 'up-left' || resizeDirection === 'left' ? 'bg-purple-200' : ''"
        @pointerdown="resizePointerDownHandler('bottom-left', $event)"
        @pointermove="resizePointerMoveHandler"
        @pointercancel="resizePointerCancelHandler"
        @pointerup="resizePointerCancelHandler"
      >
        <div
          class="resize-btn-indicator w-1 h-2 rounded-t"
          :class="resizeDirection === 'bottom-left' ? 'bg-purple-400': 'bg-gray-400'"
        />
        <div
          class="resize-btn-indicator w-1 h-1 rounded-r"
          :class="resizeDirection === 'bottom-left' ? 'bg-purple-400': 'bg-gray-400'"
        />
      </button>
      <button
        draggable="false"
        class="grow group py-1 flex justify-center items-end cursor-ns-resize touch-none"
        :class="resizeDirection === 'bottom' || resizeDirection === 'bottom-left' || resizeDirection === 'bottom-right' ? 'bg-purple-200' : ''"
        @pointerdown="resizePointerDownHandler('bottom', $event)"
        @pointermove="resizePointerMoveHandler"
        @pointercancel="resizePointerCancelHandler"
        @pointerup="resizePointerCancelHandler"
      >
        <div
          class="resize-btn-indicator w-10 h-1 rounded"
          :class="resizeDirection === 'bottom' ? 'bg-purple-400': 'bg-gray-400'"
        />
      </button>
      <button
        draggable="false"
        class="shrink-0 group pr-1 pb-1 flex justify-end items-end cursor-nwse-resize touch-none rounded-br-lg"
        :class="resizeDirection === 'bottom' || resizeDirection === 'bottom-left' || resizeDirection === 'bottom-right' || resizeDirection === 'up-right' || resizeDirection === 'right' ? 'bg-purple-200' : ''"
        @pointerdown="resizePointerDownHandler('bottom-right', $event)"
        @pointermove="resizePointerMoveHandler"
        @pointercancel="resizePointerCancelHandler"
        @pointerup="resizePointerCancelHandler"
      >
        <div
          class="resize-btn-indicator w-1 h-1 rounded-l"
          :class="resizeDirection === 'bottom-right' ? 'bg-purple-400': 'bg-gray-400'"
        />
        <div
          class="resize-btn-indicator w-1 h-2 rounded-t"
          :class="resizeDirection === 'bottom-right' ? 'bg-purple-400': 'bg-gray-400'"
        />
      </button>
    </div>
  </aside>
  <!-- eslint-disable-next-line vue/no-multiple-template-root -->
  <button
    v-show="showCatalog && sidebarFloat"
    class="p-3 sm:p-2 flex justify-center items-center fixed bottom-[8.5rem] sm:bottom-28 right-2 sm:right-4 z-40 bg-purple-100 text-purple-400 hover:text-purple-500 active:text-white active:bg-purple-500 border border-gray-200 rounded-lg"
    @click="resetFloatSidebarHandler"
  >
    <IconCustom name="bi:layout-sidebar-inset" class="w-5 h-5" />
  </button>
</template>

<style scoped lang="scss">

.resize-btn-indicator {
  @apply opacity-10 group-hover:opacity-100 transition-opacity duration-300;
}
#catalog-container, .sidebar-btn-container {
  &::-webkit-scrollbar {
    display: none;
  }
}
.sidebar-btn {
  @apply shrink-0 p-2 sm:p-1 justify-center items-center transition-colors duration-300 rounded
}
</style>
