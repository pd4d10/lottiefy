const fs = require('fs')
const path = require('path')
const { compile, compileFromFile } = require('json-schema-to-typescript')

const data = require('./animation.json')

fs.readdirSync('.').forEach(x => {
  if (fs.lstatSync(x).isDirectory()) {
    fs.readdirSync(x).forEach(y => {
      if (!data[x]) data[x] = {}
      data[x][y.slice(0, -5)] = require(path.resolve(x, y))
    })
  }
  //  else if (/\.json$/.test(x)) {
  //   properties[x.slice(0, -5)] = require(path.resolve(x))
  // }
})

// data.definitions = definitions

console.log(data)

compile(data, 'Animation', {
  // cwd: __dirname,
})
  .then(code => fs.writeFileSync('animation.d.ts', code))
  .catch(console.log)
