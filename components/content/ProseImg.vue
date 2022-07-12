
<script setup lang="ts">
const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: ''
  },
  width: {
    type: [String, Number],
    default: undefined
  },
  height: {
    type: [String, Number],
    default: undefined
  }
})

const image = ref(null)

const showZoomImage = useShowZoomImage()
const zoomImage = useZoomImage()

const clickHandler = () => {
  if (image.value) {
    const imageRect = image.value.getBoundingClientRect()
    zoomImage.value = {
      src: props.src,
      width: imageRect.width,
      height: imageRect.height,
      x: imageRect.x,
      y: imageRect.y
    }
    showZoomImage.value = 'show'
  }
}

// watch(zoom, () => {
//   if (zoom.value && document.body) {
//     document.body.classList.add('overflow-hidden')
//   }
//   if (!zoom.value) {
//     document.body.classList.remove('overflow-hidden')
//     resetTransform()
//   }
// })

// const removeClass = () => {
//   if (zoom.value && image.value) {
//     image.value.classList.remove('transition-transform')
//     image.value.classList.remove('duration-200')
//     image.value.classList.remove('ease-in-out')
//   }
// }

// const scale = ref(1)
// let translateX = 0
// let translateY = 0
// let screenScale = 1
// let screenTranslateX = 0
// let screenTranslateY = 0
// const transformValue = ref('translate(0px, 0px) scale(1)')

// const resetTransform = (type = 'origin') => {
//   if (type === 'screen') {
//     scale.value = screenScale
//     translateX = screenTranslateX
//     translateY = screenTranslateY
//   } else {
//     scale.value = 1
//     translateX = 0
//     translateY = 0
//   }
//   transformValue.value = `translate(${translateX}px, ${translateY}px) scale(${scale.value})`
// }

// const showBtns = ref(true)
// // click to zoom as large as possible to the page center
// // refer to https://github.dev/mvoloskov/fast-image-zoom
// const clickHandler = (state) => {
//   if (!image.value || !document?.documentElement) {
//     zoom.value = false
//     return
//   }

//   if (state && !zoom.value) {
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
//   } else if (state && zoom.value) {
//     // console.log('toggle show detail')
//     showBtns.value = !showBtns.value
//   } else {
//     resetTransform()
//     zoom.value = false
//   }
// }

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
</script>

<template>
  <div>
    <!-- <div
      v-show="zoom"
      class="w-screen h-screen fixed inset-0 z-[998] bg-white/30 backdrop-blur-sm cursor-zoom-out"
      :class="zoom ? 'touch-none' : ''"
      @click="clickHandler(false)"
    /> -->

    <!-- <img
      ref="image"
      class="transition-transform duration-200 ease-in-out mx-auto my-4  border border-red-400 touch-none"
      :class="zoom ? 'relative z-[999] cursor-move' : 'transition-transform duration-200 ease-in-out'"
      :src="props.src"
      :alt="props.alt"
      :width="props.width"
      :height="props.height"
      :style="`transform: ${transformValue}`"
      @click="clickHandler(true)"
      @dblclick.prevent="resetTransform('screen')"
      @wheel="scrollToZoomHandler"
      @pointerdown="pointerDownHandler"
      @pointermove="pointerMoveHandler"
      @pointercancel="pointerCancelHandler"
      @pointerup="pointerCancelHandler"
      @transitionend="removeClass"
    > -->
    <img
      ref="image"
      class="mx-auto my-4"
      :src="props.src"
      :alt="props.alt"
      :width="props.width"
      :height="props.height"
      @click="clickHandler"
    >
    <!-- <Transition
      enter-from-class="-translate-x-20 opacity-0"
      enter-active-class="transition-all duration-300 ease"
      enter-to-class="translate-x-0 opacity-100"
      leave-from-class="translate-x-0 opacity-100"
      leave-active-class="transition-all duration-75 ease"
      leave-to-class="-translate-x-20 opacity-0"
    >
      <Teleport to="body">
        <button
          v-show="zoom && showBtns"
          class="h-fit px-4 sm:px-2 py-2 flex justify-center items-center bg-purple-100 text-xs text-purple-400 hover:text-purple-500 active:text-white
        active:bg-purple-500 border border-purple-500 fixed bottom-4 sm:top-4 left-4 z-[1000] rounded"
          @click="resetTransform('screen')"
        >
          {{ Math.round(scale*100) }}%
        </button>
      </Teleport>
    </Transition>
    <Transition
      enter-from-class="translate-x-20 opacity-0"
      enter-active-class="transition-all duration-300 ease"
      enter-to-class="translate-x-0 opacity-100"
      leave-from-class="translate-x-0 opacity-100"
      leave-active-class="transition-all duration-75 ease"
      leave-to-class="translate-x-20 opacity-0"
    >
      <Teleport to="body">
        <button
          v-show="zoom && showBtns"
          class="h-fit px-4 sm:px-2 py-2 flex justify-center items-center gap-1 bg-red-100 text-xs text-red-400 hover:text-red-500 active:text-white
        active:bg-red-500 border border-red-500 fixed bottom-4 sm:top-4 right-4 z-[1000] rounded"
          @click="clickHandler(false)"
        >
          <span>Esc</span>
          <IconCustom name="ic:round-close" class="w-4 h-4" />
        </button>
      </Teleport>
    </Transition> -->
  </div>
</template>

<style lang="scss" scoped>
</style>
