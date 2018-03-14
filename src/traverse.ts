// import { v4 } from 'uuid'
import { Options } from './types'
/// <reference path="../typings/cocos2d/cocos2d-lib.d.ts" />

declare var uuid: any
const { v4 } = uuid
// import {
//   Animation,
//   Assets,
//   Height1,
//   Width2,
//   Id,
//   ImageName,
//   ImagePath,
//   Id1,
//   Layers1,
//   Items,
// } from '../typings/animation'

// type Asset =
//   | {
//       h?: Height1
//       w?: Width2
//       id?: Id
//       p?: ImageName
//       u?: ImagePath
//       [k: string]: any
//     }
//   | {
//       id?: Id1
//       layers?: Layers1
//       [k: string]: any
//     }

export function traverse(data: any, containerId: string, options: Options) {
  const getTime = (time: number) => time / data.fr
  // const getTime = (time: number) => time

  let assets: {
    [id: string]: any
  }

  function getAsset(id: string) {
    if (!assets) {
      assets = {}
      for (let asset of data.assets) {
        if (asset.id) {
          assets[asset.id] = asset
        }
      }
    }
    return assets[id]
  }

  function _traverseShape(data: any, parentId: string, id?: string, d?: any) {
    switch (data.ty) {
      case Shape.group: {
        const id = v4()
        options.createDrawNode(id, parentId)
        const d = {
          width: 0,
          color: { r: 0, g: 0, b: 0, a: 0 },
          data: [],
        }
        for (let item of data.it) {
          _traverseShape(item, parentId, id, d)
        }
        d.data.forEach((item: any[]) => {
          options.drawCubicBezier(id, item[0], item[1], item[2], item[3], d.width, d.color)
        })
      }
      case Shape.stroke: {
        if (id) {
          const [r, g, b, a] = (data.c.k as any[]).map(x => x * 255)
          d.color = { r, g, b, a }
          d.width = data.w.k
        }
      }
      case Shape.shape: {
        if (id && d) {
          const c = (x: any) => {
            const { i, o, v } = x
            const parentNode = options.getNode(parentId)

            d.data = []
            for (let j = 0; j < v.length - 1; j++) {
              d.data.push([
                cc.p(v[j][0], parentNode.height - v[j][1]),
                cc.p(v[j][0] + o[j][0], parentNode.height - v[j][1] - o[j][1]),
                cc.p(v[j + 1][0] + i[j + 1][0], parentNode.height - v[j + 1][1] - i[j + 1][1]),
                cc.p(v[j + 1][0], parentNode.height - v[j + 1][1]),
              ])
            }
            // parentNode.addChild(node)
          }
          if (data.ks) {
            if (data.ks.a) {
              c(data.ks.k[0].s[0])

              // animation
              // FIXME: shape animation
            } else {
              c(data.ks.k)
            }
          }
        }
      }
    }
  }

  // const converters = {
  //   shape(data) {

  //   }
  // }
  enum Layer {
    precomp = 0,
    solid = 1,
    image = 2,
    null = 3,
    shape = 4,
    text = 5,
  }

  enum Shape {
    ellipse = 'el',
    group = 'gr',
    shape = 'sh',
    transform = 'tr',
    stroke = 'st',
  }

  enum Effect {
    slider = 0,
    angle = 1,
    color = 2,
    point = 3,
    checkbox = 4,
    group = 5,
    dropDown = 7,
  }

  // function _traverseEffect(data: any, parentId: string, node: cc.DrawNode) {
  //   switch (data.ty) {
  //     case Effect.group: {
  //       if (data.mn === 'ADBE Gaussian Blur 2') {
  //       }
  //       for (let item of data.ef) {
  //         _traverseEffect(item, parentId, node)
  //       }
  //     }
  //     case Effect.dropDown: {
  //     }
  //   }
  // }

  function _applyAnchor(layer: any, id: string, width: number, height: number) {}

  function _applyTransform(
    layer: any,
    id: string,
    parentId: string,
    width: number,
    height: number,
    st: number,
    options: Options
  ) {
    const parseK = (k: any[]) => {
      return k.reduceRight(
        (result, item, i) => {
          const { s, e, to, ti, t } = item
          if (s) {
            result.arr.unshift({
              s,
              e,
              to,
              ti,
              t: getTime(result.nextTime - t),
              startTime: i === 0 ? getTime(t) : 0,
            })
          } else {
            // result.allTime = t
          }
          result.nextTime = t
          return result
        },
        {
          nextTime: null,
          // allTime: null,
          arr: [],
        }
      )
    }

    // anchor
    if (layer.ks.a && layer.ks.a.k) {
      const [x, y] = layer.ks.a.k
      if (typeof x === 'number' && typeof y === 'number') {
        options.setAnchorPoint(id, x / width, 1 - y / height)
      } else {
        console.log('Anchor error: ', id, layer.ks.a)
      }
    }

    // position
    if (layer.ks.p) {
      const parentHeight = options.getNode(parentId).height

      if (typeof layer.ks.p.k[0] === 'number') {
        var [x, y] = layer.ks.p.k
        options.setPosition(id, x, parentHeight - y)
      } else if (layer.ks.p.k.length) {
        options.setPosition(id, layer.ks.p.k[0].s[0], parentHeight - layer.ks.p.k[0].s[1])
        options.positionAnimate(id, parseK(layer.ks.p.k).arr, getTime(st), parentHeight)
      }
    }

    // rotation
    if (layer.ks.r && layer.ks.r.k) {
      if (typeof layer.ks.r.k === 'number') {
        options.setRotation(id, layer.ks.r.k)
      } else if (typeof layer.ks.r.k[0] === 'number') {
        options.setRotation(id, layer.ks.r.k[0])
      } else {
        options.setRotation(id, layer.ks.r.k[0].s[0])
        options.rotationAnimate(id, parseK(layer.ks.r.k).arr, getTime(st))
      }
    }

    // scale
    if (layer.ks.s) {
      if (typeof layer.ks.s.k[0] === 'number') {
        options.setScale(id, layer.ks.s.k[0] / 100, layer.ks.s.k[1] / 100)
      } else {
        options.setScale(id, layer.ks.s.k[0].s[0] / 100, layer.ks.s.k[0].s[1] / 100)
        options.scaleAnimate(id, parseK(layer.ks.s.k).arr, getTime(st))
      }
    }
  }

  function _traverseLayer(layer: any, parentId: string, options: Options, st: number) {
    // console.log(layer.nm)
    const { width, height } = options.getNode(parentId)
    // console.log(parentId, width, height)

    switch (layer.ty) {
      case Layer.shape: {
        const id = v4()
        options.createLayer(id, width, height)
        _applyTransform(layer, id, parentId, width, height, st, options)
        options.addChild(id, parentId)
        for (let shape of layer.shapes) {
          _traverseShape(shape, id)
        }
        break
      }
      case Layer.solid: {
        break
      }
      case Layer.image: {
        const id = layer.refId
        const asset = getAsset(id)
        if (!asset) break
        options.createSprite(id, asset.u + asset.p)
        options.setContentSize(id, asset.w, asset.h)
        // options.getNode(id).ignoreAnchorPointForPosition(false)
        // options.setAnchorPoint(id, layer.ks.a.k[0] / asset.w, layer.ks.a.k[1] / asset.h)
        // options.getNode(id).setPosition(layer.ks.p.k[0], layer.ks.p.k[1])
        options.addChild(id, parentId)
        _applyTransform(layer, id, parentId, asset.w, asset.h, st, options)

        break
      }
      case Layer.precomp: {
        const id = layer.refId
        const asset = getAsset(id)

        if (!asset) break

        // precomp
        options.createLayer(id, layer.w, layer.h)

        // size
        // options.setContentSize(id, layer.w || asset.w, layer.h || asset.h)

        if (layer.ks.s && layer.ks.s.k) {
          const [x, y] = layer.ks.s.k
          if (typeof x === 'number' && typeof y === 'number') {
          }
        }

        if (layer.ks.o) {
        }

        _applyTransform(layer, id, parentId, layer.w, layer.h, st, options)

        // effects
        if (layer.ef) {
          for (let item of layer.ef) {
            // _traverseEffect(item, parentId)
          }
        }

        if (asset.layers) {
          // FIXME: parent before child
          const sortedLayers = []
          const indexIdMapping: any = {}
          for (let l of asset.layers) {
            if (l.parent) {
              sortedLayers.push(l)
            } else {
              sortedLayers.unshift(l)
            }
            if (l.refId && l.ind) {
              indexIdMapping[l.ind] = l.refId
            }
          }

          for (let l of sortedLayers) {
            const correctId = l.parent ? indexIdMapping[l.parent] : id
            _traverseLayer(l, correctId, options, st + (layer.st || 0))
          }
        }

        options.addChild(id, parentId)
        break
      }
    }
  }

  function _traverse(item: any, parentId: string, options: Options) {
    for (let layer of item.layers) {
      _traverseLayer(layer, parentId, options, 0)
    }
  }

  _traverse(data, containerId, options)
}
