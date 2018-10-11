# lottiefy ![npm](https://img.shields.io/npm/v/lottiefy.svg)

A toolkit to customize Lottie renderer. Demo here: https://lottiefy.js.org

## Motivation

[Lottie](http://airbnb.io/lottie/) is a solution to transform Adobe After Effects animations directly to code. It already has web, Android and iOS renderers. But Sometimes we need more control. For example, developers may want to render Lottie to other engines, like Cocos2d-x and PixiJS. With [lottiefy](https://github.com/pd4d10/lottiefy), you can customize your own renderer in these cases.

**Notice**: It is 0.x currently, and may have breaking changes in future. Please submit an issue if something went wrong.

## Use cases

- [@lottify/cocos2dx](https://github.com/pd4d10/lottiefy/packages/cocos2dx): Render Lottie to Cocos2d-x(JS binding)
- [@lottify/cocos2dx-lua](https://github.com/pd4d10/lottiefy/packages/cocos2dx-lua) Generate Lua code to render Lottie to Cocos2d-x(Lua binding)
- [@lottify/pixi](https://github.com/pd4d10/lottiefy/packages/pixi): Render Lottie to PixiJS [WIP]
- [@lottify/spritejs](https://github.com/pd4d10/lottiefy/packages/spritejs): Render Lottie to SpriteJS [WIP]
- ...

## Installation

Install via NPM:

```sh
npm install --save lottiefy
```

Or just use UMD bundle via `script` tag:

```html
<script src="https://unpkg.com/lottiefy/dist/lottiefy.min.js"></script>
```

## Usage

```js
import { LottieRenderer } from 'lottiefy'

const renderer = new LottieRenderer({
  animationData: {}, // JSON data exported by Bodymovin
  containerId: '', // The id of container to render
  actions: {
    createPrecomp(id, payload) {
      // Specify how to create a precomp
      // ...
    },
    createImage(id, payload) {
      // Specify how to create an image
      // ...
    },
    // ...

    // List of all actions:
    // https://github.com/pd4d10/lottiefy/blob/master/src/types.ts#L53
    // Notice that all actions should be specified to make it works correctly
  },

  // Some engines like Cocos2d-x have opposite Y coordinate with Adobe After effects
  // Set reverseY to true in these cases, default is false
  reverseY: false,

  // Set animation speed
  speed: 1,
})

// Call generateAnimations to run all actions
renderer.generateAnimations()
```

## Roadmap

- [x] Precomp
- [x] Image
- [ ] Shape
- [ ] Effect
- [ ] ...

## License

MIT
