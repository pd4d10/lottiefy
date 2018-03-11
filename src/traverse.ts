// import { v4 } from 'uuid'
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

interface Options {
  createShape(
    id: string,
    parentId: string,
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number
  ): any
  createLayer(id: string): any
  createSprite(id: string, name: string): any
  setPosition(id: string, parentId: string, x: number, y: number): any
  setAnchorPoint(id: string, x: number, y: number): any
  moveTo(id: string, parentId: string, time: number, x: number, y: number): any
  setContentSize(id: string, width: number, height: number): any
  addChild(id: string, parentId: string, localZOrder?: number): any
  getNode(id: string): cc.Node
}

const getTime = (time: number) => 4 * time

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

  function _traverseShape(shape: any, parentId: string) {
    switch (shape.ty) {
      case Shape.group: {
        for (let item of shape.it) {
          _traverseShape(item, parentId)
        }
      }
      case Shape.shape: {
        const id = v4()
        const c = (x: any) => {
          const { i, o, v } = x
          for (let j = 0; j < i.length - 1; j++) {
            options.createShape(
              id,
              parentId,
              v[j + 1][0],
              v[j + 1][1],
              i[j][0],
              i[j][1],
              o[j][0],
              o[j][1],
              v[j][0],
              v[j][1]
            )
          }
          // options.createShape(
          //   id,
          //   parentId,
          //   v[i.length - 1][0],
          //   v[i.length - 1][1],
          //   o[0][0],
          //   o[0][1],
          //   i[0][0],
          //   i[0][1],
          //   v[0][0],
          //   v[0][1]
          // )
        }
        if (shape.ks) {
          console.log(shape.ks.k)
          if (Array.isArray(shape.ks.k)) {
            c(shape.ks.k[0].s[0])
          } else {
            c(shape.ks.k)
            // const { v: [[x0, y0], [x1, y1]] } = shape.ks.k
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
  }

  function _traverse(item: any, parentId: string, options: Options) {
    if (!item.layers) {
      return
    }
    const itemId = item.id

    for (let layer of item.layers) {
      console.log(layer.nm)

      const id = v4()
      // options.createLayer(id)

      switch (layer.ty) {
        case Layer.shape: {
          // if (layer.shapes) {
          for (let shape of layer.shapes) {
            _traverseShape(shape, parentId)
          }
          // } else {
          // }
          break
        }
        case Layer.solid: {
          break
        }
        case Layer.image: {
          const id = layer.refId
          const asset = getAsset(id)
          if (!asset) break
          options.createSprite(id, asset.p)
          options.setContentSize(id, asset.w, asset.h)
          options.addChild(id, parentId)
          break
        }
        case Layer.precomp: {
          const id = layer.refId
          const asset = getAsset(id)

          if (!asset) break

          if (asset.layers) {
            // precomp
            options.createLayer(id)
          }

          // size
          // options.setContentSize(id, layer.w || asset.w, layer.h || asset.h)

          if (layer.ks.s && layer.ks.s.k) {
            const [x, y] = layer.ks.s.k
            if (typeof x === 'number' && typeof y === 'number') {
            }
          }

          if (layer.ks.o) {
          }

          const parseK = (k: any[]) => {
            console.log(k)
            return k.reduceRight(
              (result, item) => {
                const { s, e, t } = item
                if (s) {
                  result.arr.unshift({ s, e, t: getTime((result.nextTime - t) / result.allTime) })
                } else {
                  result.allTime = t
                }
                result.nextTime = t
                return result
              },
              { nextTime: null, allTime: null, arr: [] }
            )
          }

          // anchor
          if (layer.ks.a && layer.ks.a.k) {
            const [x, y] = layer.ks.a.k
            if (typeof x === 'number' && typeof y === 'number') {
              let { w = 10000, h = 10000 } = layer // FIXME:
              options.setAnchorPoint(id, x / w, 1 - y / h)
            }
          }

          // position
          if (layer.ks.p) {
            if (typeof layer.ks.p.k[0] === 'number') {
              var [x, y] = layer.ks.p.k
              options.setPosition(id, parentId, x, y)
            } else if (layer.ks.p.k.length) {
              let a: any = []
              parseK(layer.ks.p.k).arr.forEach((x: any) => {
                a.push(cc.moveTo(0, x.s[0], options.getNode(parentId).height - x.s[1]))
                a.push(cc.moveTo(x.t, x.e[0], options.getNode(parentId).height - x.e[1]))
              })
              options.getNode(parentId).runAction(cc.sequence(a))
            }
          }

          // rotation
          if (layer.ks.r && layer.ks.r.k) {
            if (typeof layer.ks.r.k[0] === 'number') {
            } else {
              let a: any = []
              parseK(layer.ks.r.k).arr.forEach((x: any) => {
                a.push(cc.rotateTo(0, x.s[0]))
                a.push(cc.rotateTo(x.t, x.e[0]))
              })
              options.getNode(parentId).runAction(cc.sequence(a))
            }
          }

          // scale
          if (layer.ks.s) {
            if (typeof layer.ks.s.k[0] === 'number') {
            } else {
              let a: any = []
              parseK(layer.ks.s.k).arr.forEach((x: any) => {
                a.push(cc.scaleTo(0, x.s[0] / 100, x.s[1] / 100))
                a.push(cc.scaleTo(x.t, x.e[0] / 100, x.e[1] / 100))
              })

              options.getNode(parentId).runAction(cc.sequence(a))
            }
          }

          if (asset.layers) {
            _traverse(asset, id, options)
          }

          options.addChild(id, parentId)
          break
        }
      }
    }
  }

  _traverse(data, containerId, options)
}
