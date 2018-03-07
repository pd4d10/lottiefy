const fs = require('fs')
const path = require('path')

function lua(data) {
  let code = ''

  const append = str => {
    code += str + '\n'
  }

  append(`
    local data = {}
    local ratio = display.height / ${data.h}

    local g = display.newLayer()
    g:setContentSize(${data.w}, ${data.h})
    g:setScale(ratio)
    g:ignoreAnchorPointForPosition(false)
    g:setAnchorPoint(cc.p(0, 1))
    g:setPosition(cc.p(0, ${data.h} * ratio))
  `)

  // Convert assets to a map
  const assets = data.assets.reduce((result, item) => {
    result[item.id] = item
    return result
  }, {})

  const setAnchorPoint = (id, [x, y], { w = 10000, h = 10000 }) => {
    return `${id}:ignoreAnchorPointForPosition(false)
${id}:setAnchorPoint(cc.p(${x / w}, ${1 - y / h}))`
  }

  // Coordinate system
  const convertY = (y, id) => {
    console.log(id)
    return data.h - y
    // return y
  }

  //  Traverse layers recursively
  const traverseLayers = item => {
    if (!item.layers) {
      return
    }
    const itemId = item.id

    for (let layer of item.layers) {
      append(`-- ${layer.nm}, ${layer.refId}`)

      //   if (layer.shapes) {
      //     for (let shape of layer.shapes) {
      //       if (shape.ty === 'gr') {
      //         for (let item of shape.it) {
      //           if (item.ty === 'sh') {
      //             if (item.ks.a) {
      //             } else {
      //               const { i, o, v } = item.ks.k
      //               append(`local drawNode = cc.DrawNode:create(100)
      //               ${itemId || 'g'}:addChild(drawNode)`)
      //               // const data = []
      //               for (let j = 0; j < v.length - 1; j++) {
      //                 append(`
      //                   drawNode:drawQuadBezier(
      //                     cc.p(${v[j][0]}, ${v[j][1]}),
      //                     cc.p(0, 0),
      //                     cc.p(${v[j + 1][0]}, ${v[j + 1][1]}),
      //                     100,
      //                     cc.c4f(255, 255, 0, 255)
      //                   )
      //                 `)
      //               }
      //             }
      //           }
      //           // if (item.ty === 'st') {
      //           //   append(`cc.color4f(${item.c.k.map(x => 255 * x)})`)
      //           // }
      //         }
      //       }
      //     }
      //   }

      const asset = assets[layer.refId]

      if (asset) {
        if (asset.layers) {
          append(`local ${asset.id} = display.newLayer()`)
        }
        if (asset.p) {
          append(`local ${asset.id} = display.newSprite("#${asset.p}")`)
        }

        append(`${asset.id}:setContentSize(${layer.w || asset.w}, ${layer.h || asset.h})`)

        if (layer.ks) {
          if (layer.ks.s) {
            const [x, y] = layer.ks.s.k
            if ((typeof x === typeof y) === 'number') {
              // console.log(layer.ks.s.k)
              // append(`${asset.id}:setScaleX(${x / 100})`)
              // append(`${asset.id}:setScaleX(${y / 100})`)
            }
          }

          if (layer.ks.o) {
            // append(`${asset.id}:setOpacity(${layer.ks.o.k * 2.55})`)
          }

          if (layer.ks.p) {
            if (typeof layer.ks.p.k[0] === 'number') {
              const [x, y] = layer.ks.p.k
              append(`${asset.id}:setPosition(cc.p(${x}, ${item.id || 'g'}:getContentSize().height - ${y}))`)
              append(setAnchorPoint(asset.id, layer.ks.a.k, layer))
            } else if (layer.ks.p.k.length) {
              const [{ s, e }, { t }] = layer.ks.p.k
              append(`
                ${asset.id}:setPosition(cc.p(${s[0]}, ${item.id || 'g'}:getContentSize().height - ${s[1]}))
                ${setAnchorPoint(asset.id, layer.ks.a.k, layer)}
                -- el:setVisible(true)
                -- el:setCascadeOpacityEnabled(true)
                -- el:setOpacity(255)
                local ${asset.id}_action = cc.Sequence:create({
                  cc.MoveTo:create(${t / 30}, cc.p(${e[0]}, ${convertY(e[1])}))
                })`)
              append(`table.insert(data, { node=${asset.id},action=${asset.id}_action })`)
            }
          }
        }

        if (asset.layers) {
          traverseLayers(asset)
        }

        append(`${item.id || 'g'}:addChild(${layer.refId})`)
      }
    }
  }

  traverseLayers(data)

  code += `self:addChild(g)`

  return code
}

module.exports = {
  lua,
}
