<script setup lang="ts">
const { flatUnwrap } = useUnwrap()

const props = defineProps({
  height: {
    type: String,
    default: '400px'
  }
})

const imgContainer = ref(null)
const scrollPos = ref<'start' | 'middle' | 'end'>('start')
const showImg = ref(1)
const imgLength = ref(0)

onMounted(() => {
  if (imgContainer.value) {
    const imgList = imgContainer.value.querySelectorAll('img')
    imgLength.value = imgList.length
  }
})

const scrollHandler = (pos) => {
  if (!imgContainer.value) { return }
  if (pos === 'start') {
    imgContainer.value.scrollTop = 0
  } else if (pos === 'end') {
    imgContainer.value.scrollTop = imgContainer.value.scrollHeight - imgContainer.value.offsetHeight
  }
}

const scrollingHandler = () => {
  if (!imgContainer.value) { return }
  const scrollDistance = imgContainer.value.scrollTop
  if (scrollDistance === 0) {
    scrollPos.value = 'start'
  } else if (scrollDistance + imgContainer.value.offsetHeight >= imgContainer.value.scrollHeight) {
    scrollPos.value = 'end'
  } else {
    scrollPos.value = 'middle'
  }

  showImg.value = Math.ceil(scrollDistance / parseInt(props.height)) + 1
}

const showSidebar = ref(false)
</script>
<template>
  <div class="my-4 border border-gray-200 rounded-lg overflow-hidden">
    <div
      class="image-list-header p-2 relative z-10 flex justify-between items-center bg-gray-100 shadow-md shadow-gray-200"
    >
      <div class="flex space-x-2 items-center">
        <button
          class="btn"
          :class="showSidebar ? 'text-white bg-purple-500 hover:bg-purple-400' : 'bg-purple-100 text-purple-400 hover:text-purple-500'"
          @click="showSidebar = !showSidebar"
        >
          <IconCustom name="bi:layout-sidebar" class="w-4 h-4" />
        </button>
        <span class="text-xs">{{ showImg }}/{{ imgLength }}</span>
      </div>

      <div class="flex space-x-2 items-center">
        <button
          :disabled="scrollPos==='start'"
          class="btn bg-purple-100 text-purple-400 hover:text-purple-500 active:text-white active:bg-purple-500"
          :class="scrollPos==='start' ? 'opacity-30' : ''"
          @click="scrollHandler('start')"
        >
          <IconCustom name="material-symbols:vertical-align-top-rounded" class="w-4 h-4" />
        </button>
        <button
          :disabled="scrollPos==='end'"
          class="btn bg-purple-100 text-purple-400 hover:text-purple-500 active:text-white active:bg-purple-500"
          :class="scrollPos==='end' ? 'opacity-30' : ''"
          @click="scrollHandler('end')"
        >
          <IconCustom name="material-symbols:vertical-align-bottom-rounded" class="w-4 h-4" />
        </button>
      </div>
    </div>
    <div
      ref="imgContainer"
      class="image-list-container overflow-y-auto snap-mandatory snap-both"
      :style="`height: ${props.height}`"
      @scroll.passive="scrollingHandler"
    >
      <div
        v-for="(item, index) of flatUnwrap($slots.default(), ['p'])"
        :key="index"
        class="w-full h-full flex justify-center items-center"
      >
        <Markdown :use="() => item" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">

.image-list-container {
  &::-webkit-scrollbar {
      display: none;
    }
  @apply scroll-smooth;

  img {
    @apply max-h-full snap-center;
  }
}

.image-list-header {
  .btn {
    @apply p-1.5 flex justify-center items-center rounded transition-colors duration-300;
  }
}

</style>
