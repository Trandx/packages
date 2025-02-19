<template>
  <div ref="cropper" class="h-full w-full relative">
    <!-- Image that will be cropped -->
    <img class=" object-cover object-center h-full w-fulll invisible" ref="imageElement" :src :alt :style="imgStyle"/>
    <div v-if="loader" role="status" class="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        <svg aria-hidden="true" class="w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-400" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
        <span class="sr-only">Loading...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, StyleValue, watch } from 'vue';
import Cropper from '@/libs/cropperjs';
import '@/libs/cropperjs/index.css'; // Import the CSS for Cropper.js

type PropsType = {
  src: string,
  alt?: string,
  imgStyle?: StyleValue,
  cropBoxResizable?: boolean,
  aspectRatio?: number,
  canvasWidth?: number,
  canvasHeight?: number,
  cropBoxWidth?: number,
  cropBoxHeight?: number,
}

type EmitsType = {
  'cropstart': [elt?: any];
  'cropmove': [elt?: any];
  'cropend': [elt?: any];
  'preview': [elt?: any];
  'ready': [elt?: any];
}

const props = defineProps<PropsType>();
const emit = defineEmits<EmitsType>()
const cropperInstance = ref<Cropper | null>(null);
const imageElement = ref<HTMLImageElement>();
const cropper = ref<HTMLDivElement>()
const loader = ref<boolean>()

const getCroppedImage = (type?: string, quality?: any) => {
  const data = cropperInstance.value?.getCroppedCanvas()?.toDataURL(type, quality)
  return data
}

const getAttribute = (name: string) => cropper.value?.getAttribute(name)

const setAttribute = (name: string, value: string) => cropper.value?.setAttribute(name, value)

const initCrop = (params: PropsType) => {
  const canvasData = {
    width: params.canvasWidth || cropper.value?.clientWidth || 500,  // Resize canvas width
    height: params.canvasHeight || cropper.value?.clientHeight || 500,  // Resize canvas height
    left: 0,
    top: 0,
  }

  const cropBoxData = {
    width: params.cropBoxWidth || 200, // Set the width of the crop box
    height: params.cropBoxHeight || 200, // Set the height of the crop box
  }

  cropperInstance.value?.setCropBoxData({
    ...cropBoxData,
    left: (canvasData.width - cropBoxData.width) / 2,
    top: (canvasData.height - cropBoxData.height) / 2,
  });

  cropperInstance.value?.setCanvasData(canvasData);
}

const build = (params: PropsType) => {
  if (!imageElement.value) {
    throw 'not element'
  }
  cropperInstance.value = new Cropper(imageElement.value, {
    //...props,
    rotatable: true,
    zoomable: true,
    scalable: true,
    center: true,
    cropBoxResizable: params.cropBoxResizable,
    toggleDragModeOnDblclick: true,
    autoCrop: true,
    //autoCropArea: 0.8,
    dragMode: 'crop',
    //preview: preview.value,
    responsive: false,
    //modal: false,
    background: true,
    aspectRatio: props.aspectRatio, // For square cropping
    viewMode: 0,
    cropstart() {
      //emit('cropstart',  cropperInstance.value?.getData())
      emit('cropstart',  this.cropper)
    },
    cropmove() {
      //emit('cropmove',  cropperInstance.value?.getData())
      emit('cropmove',  this.cropper)
      emit('preview',  getCroppedImage())
    },
    cropend: () =>  emit('cropend',  getCroppedImage()),
    //crop: () => getDataCroppedImage('preview'),
    ready() {
      initCrop(params)
      cropperInstance.value?.crop();

      emit('ready',  this.cropper)

      emit('preview',  getCroppedImage())

      loader.value = false
      

    },
  });

  

}

const reset = () => {
  cropperInstance.value?.reset()
  initCrop(props)
  emit('preview',  getCroppedImage())
}

// Clear the crop box
const clear = () => cropperInstance.value?.clear()

/**
 * Replace the image's src and rebuild the cropper
 * @param url - The new URL.
 * @param onlyColorChanged - Indicate if the new image only changed color.
 * @returns this
 */
const replace = (url: string, onlyColorChanged: boolean = false) => {
  loader.value = true
  cropperInstance.value?.replace(url, onlyColorChanged)
} 

// Enable (unfreeze) the cropper
const enable = () => cropperInstance.value?.enable()

// Disable (freeze) the cropper
const disable = () => cropperInstance.value?.disable()

// Destroy the cropper and remove the instance from the image
const destroy = () => cropperInstance.value?.destroy()

/**
 * Move the canvas with relative offsets
 * @param offsetX - The relative offset distance on the x-axis.
 * @param offsetY - The relative offset distance on the y-axis.
 * @returns this
 */
const move = (offsetX: number, offsetY: number):Cropper | undefined => cropperInstance.value?.move(offsetX, offsetY)

/**
 * Move the canvas to an absolute point
 * @param x - The x-axis coordinate.
 * @param y - The y-axis coordinate.
 * @returns this
 */
const moveTo = (x: number, y: number = x) => cropperInstance.value?.moveTo(x, y)

/**
 * Zoom the canvas with a relative ratio
 * @param ratio - The target ratio.
 * @returns this
 */
const zoom = (ratio: number) => cropperInstance.value?.zoom(ratio)

/**
 * Zoom the canvas to an absolute ratio
 * @param ratio - The target ratio.
 * @returns this
 */
const zoomTo = (ratio: number) => cropperInstance.value?.zoomTo(ratio)

/**
 * Rotate the canvas with a relative degree
 * @param degree - The rotate degree.
 * @returns this
 */
const rotate = (degree: number) => cropperInstance.value?.rotate(degree)

/**
 * Rotate the canvas to an absolute degree
 * @param degree - The rotate degree.
 * @returns this
 */
const rotateTo = (degree: number) => cropperInstance.value?.rotateTo(degree)

/**
 * Scale the image on the x-axis.
 * @param scaleX - The scale ratio on the x-axis.
 * @returns this
 */
const scaleX = (scaleX: 1 | -1) => cropperInstance.value?.scaleX(scaleX)

/**
 * Scale the image on the y-axis.
 * @param scaleY - The scale ratio on the y-axis.
 * @returns this
 */
const scaleY = (scaleY: 1 | -1) => cropperInstance.value?.scaleY(scaleY)

/**
 * Scale the image
 * @param scaleX - The scale ratio on the x-axis.
 * @param [scaleY=scaleX] - The scale ratio on the y-axis.
 * @returns this
 */
const scale = (scaleX: 1 | -1, scaleY: 1 | -1 = scaleX) => cropperInstance.value?.scale(scaleX, scaleY)

 /**
 * Get the cropped area position and size data (base on the original image)
 * @param - Indicate if round the data values or not.
 * @returns The result cropped data.
 */
const getData = (rounded: boolean = false) => cropperInstance.value?.getData(rounded)


/**
 * Set the cropped area position and size with new data
 * @param data - The new data.
 * @returns this
 */
const setData = (data: Cropper.SetDataOptions) => cropperInstance.value?.setData(data)
/**
 * Get the container size data.
 * @returns The result container data.
 */
const getContainerData = () => cropperInstance.value?.getContainerData()

/**
 * Get the image position and size data.
 * @returns The result image data.
 */
const getImageData = () => cropperInstance.value?.getImageData()

/**
 * Get the canvas position and size data.
 * @returns The result canvas data.
 */
const getCanvasData = () => cropperInstance.value?.getCanvasData()

/**
 * Set the canvas position and size with new data.
 * @param data - The new canvas data.
 * @returns this
 */
const setCanvasData = (data: Cropper.SetCanvasDataOptions) => cropperInstance.value?.setCanvasData(data)

/**
 * Get the crop box position and size data.
 * @returns The result crop box data.
 */
const getCropBoxData = () => cropperInstance.value?.getCropBoxData()

/**
 * Set the crop box position and size with new data.
 * @param - The new crop box data.
 * @returns this
 */
const setCropBoxData = (data: Cropper.SetCropBoxDataOptions) => cropperInstance.value?.setCropBoxData(data)

/**
 * Get a canvas drawn the cropped image.
 * @param - The config options.
 * @returns - The result canvas.
 */
const getCroppedCanvas = (options?: Cropper.GetCroppedCanvasOptions | undefined) => cropperInstance.value?.getCroppedCanvas(options)

/**
 * Change the aspect ratio of the crop box.
 * @param aspectRatio - The new aspect ratio.
 * @returns this
 */
const setAspectRatio = (aspectRatio: number) => cropperInstance.value?.setAspectRatio(aspectRatio)

/**
 * Change the drag mode.
 * @param mode - The new drag mode.
 * @returns this
 */
const setDragMode = (mode: Cropper.DragMode) => cropperInstance.value?.setDragMode(mode)

defineExpose({
  getAttribute,
  setAttribute,
  reset,
  clear,
  replace,
  enable,
  disable,
  destroy,
  move,
  moveTo,
  zoom,
  zoomTo,
  scale,
  scaleX,
  scaleY,
  rotate,
  rotateTo,
  getData,
  setData,
  getContainerData,
  getImageData,
  getCanvasData,
  setCanvasData,
  getCropBoxData,
  setCropBoxData,
  getCroppedCanvas,
  setAspectRatio,
  setDragMode,
})

watch(props, (newValue) => {
  build(newValue)
})

// Clean up the cropper when the component is destroyed
onBeforeUnmount(() => {
  if (cropperInstance.value) {
    cropperInstance.value.destroy();
    cropperInstance.value = null;
  }
});

// Initialize the cropper when the component is mounted
onMounted(() => {

  if (imageElement.value) {
    build(props)
  }
});

</script>

<style scoped>
/* Add any additional styles here */
</style>
