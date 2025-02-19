# Tailwind CSS Grid Auto Fit Plugin

This Tailwind CSS plugin provides utilities to create responsive grid layouts using `auto-fit` with custom sizing from the theme's spacing scale. It also allows for arbitrary values to be used for the `minmax` function.

[![NPM](https://nodei.co/npm/@trandx/tailwind-auto-grid.png?downloads=true)](https://nodei.co/npm/@trandx/tailwind-auto-grid)


## Table of Contents

- [Capture](#Capture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Changing the grid item size](#changing-the-grid-item-size)
- [If issues](#If-issues)
- [Author](#Author)
- [License](#license)

## Capture

[![alt text](https://github.com/Trandx/tailwind-config/blob/main/src/plugin/auto-grid/public/capture.png)](https://github.com/Trandx/tailwind-config/blob/main/src/plugin/auto-grid)

## Installation
```shell
    pnpm add -D @trandx/tailwind-auto-grid
```
or

```shell
    npm i -D @trandx/tailwind-auto-grid
```

## Configuration

To enable the plugin, add it to your tailwind.config.js:

```js

import type { Config } from 'tailwindcss/types';

import autoGridPlugin from '@trandx/tailwind-auto-grid';

// Export the full Tailwind configuration
const tailwindConfig: Config = {
  content: [],
    theme: {
        extend: {
        // Your theme customizations
        },
    },
    plugins: [
        // Your plugin
        autoGridPlugin,
    ],
};

export default tailwindConfig;

```

or

```js
// tailwind.config.js
const autoGridPlugin = require('@trandx/tailwind-auto-grid');

module.exports = {
  theme: {
    extend: {
      // Your theme customizations
    },
  },
  plugins: [
    autoGridPlugin,
  ],
};

```

## Usage

use arbitrary values with the `.grid-auto-fit` utility classes to create responsive grids:

```html

<div class="grid grid-auto-fit-xs gap-4">
    <div class="bg-gray-200">Item 1</div>
    <div class="bg-gray-200">Item 2</div>
    <div class="bg-gray-200">Item 3</div>
</div>

```

Alternatively, use arbitrary values with the `.grid-auto-fill` utility:

```html

<div class="grid grid-auto-fill-[10rem] gap-4">
    <div class="bg-gray-200">Item 1</div>
    <div class="bg-gray-200">Item 2</div>
    <div class="bg-gray-200">Item 3</div>
</div>

```
## Changing the grid item size

Use utilities like `.grid-auto-fit-sm`, `.grid-auto-fit-xl` or `.grid-auto-fill-sm`, `.grid-auto-fill-xl` to change the minimum and maximum item size of the responsive grid. This plugin includes five item sizes with the default minimum size being 16rem and can take custom value in `px`, `rem`, etc...

| Class                                                 | Minimum item width |
| ----------------------------------------------------- | ------------------ |
| `grid-auto-fill-xs` or `grid-auto-fit-xs`             | `6rem`             |
| `grid-auto-fill`    or `grid-auto-fit`                | `8rem`             |
| `grid-auto-fill-sm` or `grid-auto-fit-sm`             | `10rem`            |
| `grid-auto-fill-md` or `grid-auto-fill-md`            | `14rem`            |
| `grid-auto-fill-lg` or `grid-auto-fit-lg`             | `18rem`            |
| `grid-auto-fill-xl` or `grid-auto-fit-xl`             | `22rem`            |
| `grid-auto-fill-[250px]` or `grid-auto-fit-[250px]`   | `250px`            |

## If Issues

In case you notice any irregularities in benchmark or you want to add sort library to benchmark score
please open issue [here](https://github.com/Trandx/tailwind-config/issues)

## Author

[![alt text](https://avatars.githubusercontent.com/u/42522718?s=100)](https://github.com/Trandx)

## License

MIT
