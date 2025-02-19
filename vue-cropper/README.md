# Vue-Cropper

Vue-Cropper is a lightweight (100 Kbytes gzip), zero-dependency sorting library with TypeScript support. This package is based on [cropperjs](https://github.com/fengyuanchen/cropperjs).

[![NPM](https://nodei.co/npm/@trandx/vue-cropper.png?downloads=true)](https://nodei.co/npm/@trandx/vue-cropper/)

## Table of Contents

- [Demo](#Demo)
- [Capture](#Capture)
- [Features](#features)
- [Installation](#installation)
- [Compatibility](#Compatibility)
- [Usage](#usage)
- [Props](#Props)
- [Events](#events)
- [Methods](#methods)
- [If issues](#If-issues)
- [More about Cropperjs](#More-about-cropperjs)
- [Author](#Author)
- [License](#license)

## Demo

Checkout **[Here](https://vue-cropper-example.vercel.app/)**

## Capture

[![alt text](https://github.com/Trandx/vue-cropper/blob/main/public/capture.png)](https://github.com/Trandx/vue-cropper)

## Features

- Easy to integrate with Vue.js applications.
- Responsive and user-friendly interface.
- Support for various image formats.
- Customizable aspect ratios and crop dimensions.
- Preview functionality.
- lord image since an url and crop it.

## Installation

You can install the Vue-Cropper component via npm:

```shell
npm install --save @trandx/vue-cropper
```
or
```shell
yarn add @trandx/vue-cropper
```

```shell
pnpm add @trandx/vue-cropper
```

# Compatibility
| Vue Version | Package Version |
| ---------- | --------------- |
| 3.x.x      | >=1.0.0         |

## Usage

```vue
<template>
  <div class=" h-[350px] bg-primary-500 rounded-lg border-2 border-gray-800">
    <Cropper
      ref="cropper"
      :src="imgSrc"
      alt="Source Image"
      :aspectRatio="4 / 3"
      :cropBoxResizable="true"
      @ready="..."
      @cropstart="..."
      @cropmove="..."
      @cropend="..."
      @preview="..."
    />
  </div>
  <button class="" @click.prevent="cropImage"> Crop </button>
  ...
  <button class="" @click.prevent="zoom(-0.2)"> Zoom Out </button> showChosenImage
  <button class="" @click.prevent="showChosenImage"> Change Image </button>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { VueCropper as Cropper } from '@trandx/vue-cropper'
  import '@trandx/vue-cropper/lib/style.css';

  type ScaleType =  1 | -1
  type VueCropperType = InstanceType<typeof VueCropper>

  const cropper = ref<VueCropperType>()
  const cropImg = ref<string>()
  const previewImg = ref<string>()
  const preview = (data: string) => {
    previewImg.value = data
    //previewImg.value = cropper.value?.getCroppedCanvas().toDataURL('image/png', 1)
  }
  const cropstart = (data: VueCropperType) => {
    //const imgUrl = data?.getCroppedCanvas()?.toDataURL('image/png', 1)
    //const data = cropper.value?.getCroppedCanvas().toDataURL('image/png', 1)
    console.log('crop start!', data);
  }
  const cropend = (data: string) => {
    cropImg.value = data
    //const data = data?.getCroppedCanvas().toDataURL('image/png', 1)
    //const data = cropper.value?.getCroppedCanvas().toDataURL('image/png', 1)
    console.log('crop end!');
  }
  const cropImage = () => {
    cropImg.value = cropper.value?.getCroppedCanvas().toDataURL('image/png', 1)
  }
  const move = (x: number, y: number) => cropper.value?.move(x, y)
  const rotate = (deg: number) => cropper.value?.rotate(deg)
  const flipX = () => {
    let scale = -(cropper.value?.getAttribute('data-scale-x') || 1);
    cropper.value?.scaleX(scale)
    cropper.value?.setAttribute('data-scale-x', scale);
  }
  const flipY = () => {
    let scale = -(cropper.value?.getAttribute('data-scale-y') || 1);
    cropper.value?.scaleX(scale)
    cropper.value?.setAttribute('data-scale-y', scale);
  }
  const reset = () => cropper.value?.reset()
  const zoom = (percent: number) => cropper.value?.zoom(percent)
  const showChosenImage = () => {
    //here, url can be every toDataUrl() or URL 
    const id = Math.floor(Math.random() * 90) + 1;
    const url = 'https://placedog.net/400/358?id='+id
    cropper.value?.replace(url)
  }
</script>
```
for more example details go on **[this repos](https://github.com/Trandx/vue-cropper/tree/develop/example/src)**

## Props

| Prop Name          | Type        | Default  | Description                                        |
|--------------------|-------------|----------|----------------------------------------------------|
| `src`              | `string`    | -        | The source URL of the image to be cropped.         |
| `alt`              | `string`    | -        | Alternative text for the image (optional).         |
| `imgStyle`         | `StyleValue`| -        | Custom styles for the image element (optional).    |
| `cropBoxResizable`  | `boolean`  | `true`   | Enables or disables resizing of the crop box.      |
| `aspectRatio`      | `number`    | -        | Representing the width-to-height ratio of the cropping box.     |
| `canvasWidth`      | `number`    | -        | The width of the canvas for the cropped image.     |
| `canvasHeight`     | `number`    | -        | The height of the canvas for the cropped image.    |
| `cropBoxWidth`     | `number`    | -        | The width of the crop box in pixels.               |
| `cropBoxHeight`    | `number`    | -        | The height of the crop box in pixels.              |

## Events

| Event Name   | Payload Type     | Description                                       |
|--------------|------------------|---------------------------------------------------|
| `cropstart`  | `[elt?: Cropper]`| Emitted when cropping starts.                     |
| `cropmove`   | `[elt?: Cropper]`| Emitted when the crop area changes.               |
| `cropend`    | `[data?: string]`| Emitted when cropping ends.                       |
| `preview`    | `[elt?: string]` | Emitted to provide a preview of the cropped area. |
| `ready`      | `[elt?: Cropper]`| Emitted when the cropper is ready for use.        |


## Methods
| Method             | Parameters                                           | Returns                       | Description                                    |
|--------------------|-----------------------------------------------------|-------------------------------|------------------------------------------------|
| `reset`            | None                                                | void                          | Resets the cropper instance.                   |
| `clear`            | None                                                | void                          | Clears the crop box.                           |
| `replace`          | `url: string`, `onlyColorChanged: boolean = false`  | this                          | Replaces the image's src and rebuilds the cropper. |
| `enable`           | None                                                | void                          | Enables the cropper.                           |
| `disable`          | None                                                | void                          | Disables the cropper.                          |
| `destroy`          | None                                                | void                          | Destroys the cropper instance.                 |
| `move`             | `offsetX: number`, `offsetY: number`                | `Cropper`                    | Moves the canvas with offsets.                 |
| `moveTo`           | `x: number`, `y: number = x`                        | void                          | Moves canvas to a specific point.              |
| `zoom`             | `ratio: number`                                    | void                          | Zooms the canvas relatively.                   |
| `zoomTo`           | `ratio: number`                                    | void                          | Zooms to an absolute ratio.                    |
| `rotate`           | `degree: number`                                  | void                          | Rotates the canvas relatively.                 |
| `rotateTo`         | `degree: number`                                  | void                          | Rotates the canvas to a specific degree.      |
| `scaleX`           | `scaleX: 1 or -1`                                  | void                          | Scales image on the x-axis.                   |
| `scaleY`           | `scaleY: 1 or -1`                                  | void                          | Scales image on the y-axis.                   |
| `scale`            | `scaleX: 1 or -1`, `scaleY: 1 or -1 = scaleX`      | void                          | Scales image on both axes.                     |
| `getData`          | `rounded: boolean = false`                         | Cropped data                 | Gets cropped area data.                        |
| `setData`          | `data: Cropper.SetDataOptions`                    | this                          | Sets cropped area data.                        |
| `getContainerData` | None                                                | Container data               | Gets container size data.                      |
| `getImageData`     | None                                                | Image data                   | Gets image position and size data.             |
| `getCanvasData`    | None                                                | Canvas data                  | Gets canvas position and size data.            |
| `setCanvasData`    | `data: Cropper.SetCanvasDataOptions`                 | this                          | Sets canvas position and size.                 |
| `getCropBoxData`   | None                                                | Crop box data                | Gets crop box position and size data.         |
| `setCropBoxData`   | `data: Cropper.SetCropBoxDataOptions`                | this                          | Sets crop box data.                            |
| `getCroppedCanvas` | `options: Cropper.GetCroppedCanvasOptions`         | Result canvas               | Gets a canvas with the cropped image.         |
| `setAspectRatio`   | `aspectRatio: number`                              | this                          | Changes the crop box aspect ratio.             |
| `setDragMode`      | `mode: Cropper.DragMode`                          | this                          | Changes the drag mode.                         |


## If Issues

In case you notice any irregularities in benchmark or you want to add sort library to benchmark score
please open issue [here](https://github.com/Trandx/vue-cropper/issues)

## More about Cropperjs

See cropperjs [documentation](https://github.com/fengyuanchen/cropperjs#options) for all posible options & methods.

## Author

[![alt text](https://avatars.githubusercontent.com/u/42522718?s=100)](https://github.com/Trandx)

## License

MIT