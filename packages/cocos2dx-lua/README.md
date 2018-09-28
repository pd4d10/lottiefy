# `cocos2dx-lua`

Generate Lua code to render Lottie to Cocos2dx(Lua binding)

## Usage

```js
const lottieCocos2dxLua = require('lottie-cocos2dx-lua')
const luaCode = lottieCocos2dxLua({
  data: {}, // JSON data exported by Bodymovin
  containerId: 'container', // The variable name of container
})

console.log(luaCode)
```

## License

MIT
