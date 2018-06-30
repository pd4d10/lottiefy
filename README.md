# lottie-renderer

A toolkit to customize Lottie renderer. Demo here: https://pd4d10.github.io/lottie-renderer/

## Motivation

[Lottie](http://airbnb.io/lottie/) is a solution to transform Adobe After Effects animations directly to code. It already has web, Android and iOS renderers.

But Sometimes we need more control. For example, developers may want to render Lottie to other engines like Cocos2d-x and PixiJS. [lottie-renderer](https://github.com/pd4d10/lottie-renderer) comes to rescue in these cases.

**Notice**: It hasn't reached 1.x, and may cause breaking changes in future. Please submit an issue if something went wrong.

## Use cases

- [lottie-cocos2dx](https://github.com/pd4d10/lottie-cocos2dx): Render Lottie to Cocos2d-x(JS binding)
- [lottie-cocos2dx-lua](https://github.com/pd4d10/lottie-cocos2dx-lua) Generate Lua code to render Lottie to Cocos2d-x(Lua binding)
- [lottie-pixi](https://github.com/pd4d10/lottie-pixi): Render Lottie to PixiJS [Work in progress]
- ...

## Installation

Install via NPM:

```sh
npm install --save lottie-renderer
```

Or just use UMD bundle via `script` tag:

```html
<script src="https://unpkg.com/lottie-renderer/dist/lottie-renderer.min.js"></script>
```

## Usage

```js
import LottieRenderer from 'lottie-renderer'

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
    // https://github.com/pd4d10/lottie-renderer/blob/master/src/types.ts#L53
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
