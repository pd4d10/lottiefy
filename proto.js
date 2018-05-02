const fs = require('fs')

// Draw prototype graph
const data = fs.readFileSync('lottie.js', 'utf8')

const reg = /extendPrototype\(\[(.*)\]\s*,(.*)\s*\)/g

const matches = data.match(reg)

const x = matches
  .map(item => {
    const obj = JSON.parse(item.replace(reg, '{"parent":"$1","item":"$2"}'))
    obj.parent = obj.parent.split(/\s*,\s*/)
    if (obj.parent.includes('createProxyFunction(_prototype)')) {
      return null
    }
    return obj.parent.map(y => obj.item + '->' + y).join(';')
  })
  .filter(z => z != null)

console.log('digraph {' + x.join(';\n') + '}')
