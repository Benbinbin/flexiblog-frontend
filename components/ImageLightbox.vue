<script setup lang="ts">
const showZoomImage = useShowZoomImage()
const zoomImage = useZoomImage()
const showBlurBg = ref(false)
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
const transformValue = ref('translate(0px, 0px) scale(1)')

const resetTransform = (type = 'origin') => {
  if (type === 'screen') {
    scale.value = 1
    translateX = 0
    translateY = 0
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
 * refer to https://github.dev/mvoloskov/fast-image-zoom
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
    showBlurBg.value = true
    toggleImageClassName('remove')
  }
}

const onBeforeLeave = () => {
  toggleImageClassName('add')
  showBlurBg.value = false
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

const clickHandler = (state) => {
  if (state && zoomImage.value) {
    // show or hide the control buttons
    showBtns.value = !showBtns.value
  } else {
    // begin hiding the image
    showZoomImage.value = 'hiding'
  }
}

// scroll mouse to zoom
// listening the wheel event set the scale transform to zoom the image
// (the transform origin is center as default, so it need to set the x and y translate at the same time to compensate offset by the zoom effect) make the zoom center point is the same as mouse point
// base on wheel event so it support mouse scroll or pinch in trackpad
// refer to https://stackoverflow.com/a/70251437/10699431
const miniScale = 0.2
const maxScale = 10
const scrollToZoomHandler = (event) => {
  if (showZoomImage.value === 'show' && zoomImage.value) {
    event.stopPropagation()
    event.preventDefault()
    const delta = (event.wheelDelta ? event.wheelDelta : -event.deltaY)

    // pinch in the trackpad is imitate the wheel event
    // but the Ctrl key will be always true
    console.log(event)
    const dScale = event.ctrlKey ? 0.05 : 0.2

    // zoom the image
    const currentScale = delta > 0 ? (scale.value + dScale) : (scale.value - dScale)

    if (currentScale < miniScale || currentScale > maxScale) { return }

    scale.value = currentScale

    // get the mouse position relative to image (left-top as reference point)
    const mouseRelativeX = event.offsetX
    const mouseRelativeY = event.offsetY

    console.log(mouseRelativeX, event.clientX - image.value.getBoundingClientRect().x)

    // adjust the x and y translate (on the opposite direction) to compensate the offset when scale to imitate scale origin as the mouse point
    const coefficient = delta > 0 ? dScale : -dScale

    translateX += (-mouseRelativeX * coefficient) + (image.value.clientWidth * coefficient / 2)
    translateY += (-mouseRelativeY * coefficient) + (image.value.clientHeight * coefficient / 2)

    transformValue.value = `translate(${translateX}px, ${translateY}px) scale(${scale.value})`
  }
}

/**
 *
 * pinch to zoom
 * listening the pointer event
 *
 */
let startPointerA = null
let startPointerB = null
let pointerA = null
let pointerB = null
let originRelativeX = 0
let originRelativeY = 0
let prevDistance = 0

const getDistance = (a, b) => {
  return Math.sqrt((b.clientX - a.clientX) ** 2 + (b.clientY - a.clientY) ** 2)
}

const pointerDownHandler = (event) => {
  if (!showZoomImage.value) { return }

  if (!pointerA) {
    startPointerA = event
    pointerA = startPointerA
  } else if (!pointerB) {
    startPointerB = event
    pointerB = startPointerB
  }

  if (pointerA && pointerB) {
    // calculate the distance as reference value before the move event
    prevDistance = getDistance(pointerA, pointerB)

    // get the pinch center of this two pointer relative to image
    originRelativeX = (startPointerA.offsetX + startPointerB.offsetX) / 2
    originRelativeY = (startPointerA.offsetY + startPointerB.offsetY) / 2
  }
}

const pointerMoveHandler = (event) => {
  if (showZoomImage.value && pointerA && pointerB) {
    event.preventDefault()

    // use current event to update the pointer
    if (event.pointerId === pointerA.pointerId) {
      pointerA = event
    } else if (event.pointerId === pointerB.pointerId) {
      pointerB = event
    }

    // calculate the two points current distance in this move event
    const currentDistance = getDistance(pointerA, pointerB)

    // pinch in the touch screen
    const divisor = 100

    const distanceDiff = (currentDistance - prevDistance) / divisor
    // console.log(distanceDiff)

    const currentScale = scale.value + distanceDiff
    if (currentScale < miniScale || currentScale > maxScale) { return }

    scale.value = currentScale

    // adjust the x and y translate (on the opposite direction) to compensate the offset when scale to imitate scale origin as the mouse point
    translateX += (-originRelativeX * distanceDiff) + (image.value.clientWidth * distanceDiff / 2)
    translateY += (-originRelativeY * distanceDiff) + (image.value.clientHeight * distanceDiff / 2)

    // update the previous distance as reference value for next move event
    prevDistance = currentDistance

    transformValue.value = `translate(${translateX}px, ${translateY}px) scale(${scale.value})`
  }
}

const pointerCancelHandler = (event) => {
  if (pointerA && event.pointerId === pointerA.pointerId) {
    pointerA = null
  } else if (pointerB && event.pointerId === pointerB.pointerId) {
    pointerB = null
  }

  if (!pointerA || !pointerB) {
    // reset the previous distance as reference value for next move event
    prevDistance = 0
    originRelativeX = 0
    originRelativeY = 0
  }
}
</script>

<template>
  <div
    v-show="showZoomImage !== 'hidden'"
    class="w-screen h-screen fixed inset-0 z-[999] flex justify-center items-center cursor-zoom-out"
    :class="(showZoomImage !== 'hidden' && showBlurBg) ? 'touch-none bg-white/30 backdrop-blur-sm' : ''"
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
        class="mx-auto border border-red-400 cursor-move touch-none"
        :src="zoomImage ? zoomImage.src : ''"
        :alt="zoomImage ? zoomImage.alt : ''"
        :style="`width: ${width}px; height: ${height}px; transform: ${transformValue}`"
        @transitionend="transitionEndHandler"
        @dblclick="resetTransform('screen')"
        @click.stop.prevent="clickHandler(true)"
        @wheel="scrollToZoomHandler"
        @pointerdown="pointerDownHandler"
        @pointermove="pointerMoveHandler"
        @pointercancel="pointerCancelHandler"
        @pointerup="pointerCancelHandler"
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
        active:bg-purple-500 border border-purple-500 fixed top-4 left-4 z-[1000] rounded"
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
        active:bg-red-500 border border-red-500 fixed top-4 right-4 z-[1000] rounded"
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
