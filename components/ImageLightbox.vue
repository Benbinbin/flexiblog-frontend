<script setup lang="ts">
const showZoomImage = useShowZoomImage()
const zoomImage = useZoomImage()

// stop body scroll
watch(showZoomImage, () => {
  if (showZoomImage.value !== 'hidden' && document.body) {
    document.body.classList.add('overflow-hidden')
  }
  if (showZoomImage.value === 'hidden') {
    document.body.classList.remove('overflow-hidden')
  }
})

const image = ref(null)

const width = ref(0)
const height = ref(0)
const scale = ref(1)
let translateX = 0
let translateY = 0
const screenScale = 1
const screenTranslateX = 0
const screenTranslateY = 0
const transformValue = ref('translate(0px, 0px) scale(1)')

const resetTransform = (type = 'origin') => {
  if (type === 'screen') {
    scale.value = screenScale
    translateX = screenTranslateX
    translateY = screenTranslateY
  } else {
    width.value = 0
    height.value = 0
    scale.value = 1
    translateX = 0
    translateY = 0
  }
  transformValue.value = `translate(${translateX}px, ${translateY}px) scale(${scale.value})`
}

/**
 *
 * show or hide transition
 *
 */
// toggle image class name
const toggleImageClassName = (action = 'add') => {
  if (!image.value) { return }
  if (action === 'add') {
    image.value.classList.add('transition-all')
    image.value.classList.add('duration-100')
    image.value.classList.add('ease-in-out')
  } else {
    image.value.classList.remove('transition-all')
    image.value.classList.remove('duration-100')
    image.value.classList.remove('ease-in-out')
  }
}

// zoomImage init size and position
const transitionInitial = () => {
  if (!zoomImage.value || !document?.documentElement) { return }

  // the zoomImage init size
  width.value = zoomImage.value.width
  height.value = zoomImage.value.height

  // get the translate and scale between current/expect state and zoomImage init position
  translateX = 0
  const windowHeight = document.documentElement.clientHeight
  translateY = -(windowHeight / 2 - (zoomImage.value.y + zoomImage.value.height / 2))
  scale.value = 1

  transformValue.value = `translate(${translateX}px, ${translateY}px) scale(${scale.value})`
}

const onBeforeEnter = () => {
  toggleImageClassName('add')
  transitionInitial()
}

const onAfterEnter = () => {
  if (zoomImage.value && document.documentElement) {
    const windowWidth = document.documentElement.clientWidth
    const windowHeight = document.documentElement.clientHeight

    const widthScale = windowWidth / zoomImage.value.width
    const widthScaleSafe = widthScale * zoomImage.value.height <= windowHeight

    const zoomImageWidthHeightRatio = zoomImage.value.width / zoomImage.value.height

    if (widthScaleSafe) {
      width.value = windowWidth
      height.value = width.value / zoomImageWidthHeightRatio
    } else {
      height.value = windowHeight
      width.value = height.value * zoomImageWidthHeightRatio
    }
  }

  translateX = 0
  translateY = 0
  scale.value = 1
  transformValue.value = `translate(${translateX}px, ${translateY}px) scale(${scale.value})`
  showBtns.value = true
}

const transitionEndHandler = () => {
  if (showZoomImage.value === 'show') {
    toggleImageClassName('remove')
  }
}

const onBeforeLeave = () => {
  toggleImageClassName('add')
}

const onLeave = () => {
  transitionInitial()
}

const onAfterLeave = () => {
  toggleImageClassName('remove')

  zoomImage.value = null
  showZoomImage.value = 'hidden'
  resetTransform()
  showBtns.value = false
}

const showBtns = ref(false)
// click to zoom as large as possible to the page center
// refer to https://github.dev/mvoloskov/fast-image-zoom
const clickHandler = (state) => {
  // if (state && zoomImage.value) {
  //   console.log(zoomImage.value.src)

  //     const windowWidth = document.documentElement.clientWidth
  //     const windowHeight = document.documentElement.clientHeight

  //     const pageCenterX = windowWidth / 2
  //     const pageCenterY = windowHeight / 2

  //     const imageRect = image.value.getBoundingClientRect()

  //     const widthScale = windowWidth / imageRect.width
  //     const heightScale = windowHeight / imageRect.height

  //     const widthScaleSafe = widthScale * imageRect.height <= windowHeight

  //     // set init scale.value
  //     if (widthScaleSafe) {
  //       scale.value = widthScale
  //     } else {
  //       scale.value = heightScale
  //     }

  //     screenScale = scale.value

  //     translateX = (pageCenterX - (imageRect.x + imageRect.width / 2))
  //     translateY = (pageCenterY - (imageRect.y + imageRect.height / 2))

  //     screenTranslateX = translateX
  //     screenTranslateY = translateY

  //     transformValue.value = `translate(${translateX}px, ${translateY}px) scale(${scale.value})`

  //     zoom.value = true
  // }

  if (state && zoomImage.value) {
    showBtns.value = !showBtns.value
  } else {
    showZoomImage.value = 'hiding'
    // resetTransform()
    // showZoomImage.value = false
  }
}

// // scroll the wheel to zoom on the mouse point
// // refer to https://stackoverflow.com/a/70251437/10699431
// const dScale = 0.4
// const scrollToZoomHandler = (event) => {
//   // zoom the image if scroll
//   if (zoom.value) {
//     event.stopPropagation()
//     event.preventDefault()
//     const delta = (event.wheelDelta ? event.wheelDelta : -event.deltaY)

//     // zoom the image
//     const currentScale = delta > 0 ? (scale.value + dScale) : (scale.value - dScale)

//     if (currentScale < 0.6 || currentScale > 10) { return }

//     scale.value = currentScale

//     // get the mouse position relative to image (left-top as reference point, divide scale.value value to calculate the origin offset distance)
//     const mouseRelativeX = event.offsetX
//     const mouseRelativeY = event.offsetY

//     // adjust the translate (on the opposite direction) to compensate the offset when scale.value to imitate scale.value origin as the mouse point
//     const coefficient = delta > 0 ? dScale : -dScale

//     translateX += (-mouseRelativeX * coefficient) + (image.value.clientWidth * coefficient / 2)
//     translateY += (-mouseRelativeY * coefficient) + (image.value.clientHeight * coefficient / 2)

//     transformValue.value = `translate(${translateX}px, ${translateY}px) scale(${scale.value})`
//   }
// }

// let pointerA = null
// let pointerB = null
// let prevDistance = 0

// const getDistance = (a, b) => {
//   return Math.sqrt((b.clientX - a.clientX) ** 2 + (b.clientY - a.clientY) ** 2)
// }

// const pointerDownHandler = (event) => {
//   if (!zoom.value) { return }

//   // console.log(event)

//   if (!pointerA) {
//     pointerA = event
//   } else if (!pointerB) {
//     pointerB = event
//   }

//   if (pointerA && pointerB) {
//     prevDistance = getDistance(pointerA, pointerB)
//     console.log(prevDistance)
//   }
// }

// const pointerMoveHandler = (event) => {
//   // console.log(event)
//   if (zoom.value && pointerA && pointerB) {
//     event.preventDefault()

//     const originX = (pointerA.clientX + pointerB.clientX) / 2
//     const originY = (pointerA.clientY + pointerB.clientY) / 2

//     const imageRect = image.value.getBoundingClientRect()

//     const originRelativeX = originX - imageRect.x
//     const originRelativeY = originY - imageRect.y

//     if (event.pointerId === pointerA.pointerId) {
//       pointerA = event
//     } else if (event.pointerId === pointerB.pointerId) {
//       pointerB = event
//     }

//     const currentDistance = getDistance(pointerA, pointerB)

//     const divisor = event.ctrlKey ? 100 : 300

//     const distanceDiff = (currentDistance - prevDistance) / divisor
//     console.log(distanceDiff)

//     const currentScale = scale.value + distanceDiff
//     if (currentScale < 0.6 || currentScale > 10) { return }

//     scale.value = currentScale

//     translateX += (-originRelativeX * distanceDiff) + (image.value.clientWidth * distanceDiff / 2)
//     translateY += (-originRelativeY * distanceDiff) + (image.value.clientHeight * distanceDiff / 2)

//     prevDistance = currentDistance

//     transformValue.value = `translate(${translateX}px, ${translateY}px) scale(${scale.value})`
//   }
// }

// const pointerCancelHandler = (event) => {
//   if (pointerA && event.pointerId === pointerA.pointerId) {
//     pointerA = null
//   } else if (pointerB && event.pointerId === pointerB.pointerId) {
//     pointerB = null
//   }

//   if (!pointerA || !pointerB) {
//     prevDistance = 0
//   }
// }

// const removeClass = () => {
//   if (showZoomImage.value && image.value) {
//     image.value.classList.remove('transition-transform')
//     image.value.classList.remove('duration-1000')
//     image.value.classList.remove('ease-in-out')
//   }
// }
</script>

<template>
  <div
    v-show="showZoomImage !== 'hidden'"
    class="w-screen h-screen fixed inset-0 z-[999] flex justify-center items-center bg-white/30 backdrop-blur-sm cursor-zoom-out"
    :class="showZoomImage !== 'hidden' ? 'touch-none' : ''"
    @click="clickHandler(false)"
  >
    <Transition
      @before-enter="onBeforeEnter"
      @after-enter="onAfterEnter"
      @before-leave="onBeforeLeave"
      @leave="onLeave"
      @after-leave="onAfterLeave"
    >
      <img
        v-show="showZoomImage === 'show' && zoomImage"
        ref="image"
        class="mx-auto border border-red-400 cursor-move"
        :src="zoomImage ? zoomImage.src : ''"
        :alt="zoomImage ? zoomImage.alt : ''"
        :style="`width: ${width}px; height: ${height}px; transform: ${transformValue}`"
        @click.stop.prevent="clickHandler(true)"
        @transitionend="transitionEndHandler"
      >
    </Transition>

    <Transition
      enter-from-class="-translate-x-20 opacity-0"
      enter-active-class="transition-all duration-200 ease"
      enter-to-class="translate-x-0 opacity-100"
      leave-from-class="translate-x-0 opacity-100"
      leave-active-class="transition-all duration-75 ease"
      leave-to-class="-translate-x-20 opacity-0"
    >
      <button
        v-show="showBtns"
        class="h-fit px-4 sm:px-2 py-2 flex justify-center items-center bg-purple-100 text-xs text-purple-400 hover:text-purple-500 active:text-white
        active:bg-purple-500 border border-purple-500 fixed bottom-4 sm:top-4 left-4 z-[1000] rounded"
        @click.stop.prevent="resetTransform('screen')"
      >
        {{ Math.round(scale * 100) }}%
      </button>
    </Transition>
    <Transition
      enter-from-class="translate-x-20 opacity-0"
      enter-active-class="transition-all duration-200 ease"
      enter-to-class="translate-x-0 opacity-100"
      leave-from-class="translate-x-0 opacity-100"
      leave-active-class="transition-all duration-75 ease"
      leave-to-class="translate-x-20 opacity-0"
    >
      <button
        v-show="showBtns"
        class="h-fit px-4 sm:px-2 py-2 flex justify-center items-center gap-1 bg-red-100 text-xs text-red-400 hover:text-red-500 active:text-white
        active:bg-red-500 border border-red-500 fixed bottom-4 sm:top-4 right-4 z-[1000] rounded"
        @click.stop.prevent="clickHandler(false)"
      >
        <span>Esc</span>
        <IconCustom name="ic:round-close" class="w-4 h-4" />
      </button>
    </Transition>
  </div>
</template>

<style scoped>

</style>
