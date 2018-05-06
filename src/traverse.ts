import { v4 } from 'uuid'
import { Actions, Layer, Shape, Effect, Color, Keyframe } from './types'

const genId = (nm?: string) => {
  return (nm || 'v') + '_' + v4().replace(/-/g, '_') // for lua variables
}

function convertColor(c: Color) {
  return c.map(n => n * 255)
}

export default class LottieRenderer {
  data: any // JSON data exported by Bodymovin
  containerId: string // Container
  assets: { [id: string]: any }
  actions: Actions

  /**
   * Get second of time
   * @param frame
   */
  getTime(frame: number) {
    return frame / this.data.fr
  }

  constructor(data: any, containerId: string, actions: Actions) {
    this.data = data
    this.containerId = containerId
    this.actions = actions

    this.assets = {}
    for (let asset of data.assets) {
      if (asset.id) {
        this.assets[asset.id] = asset
      }
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

    for (let layer of data.layers) {
      this._traverseLayer(layer, containerId, actions, 0, data.w, data.h)
    }
  }

  _applyAnchor(layer: any, id: string, width: number, height: number) {}

  _traverseShape(
    data: any,
    parentId: string,
    parentWidth: number,
    parentHeight: number,
    id?: string,
    d?: any,
  ) {
    switch (data.ty) {
      case Shape.group: {
        const id = genId()
        const d: any = {
          id,
          stroke: null,
          shape: [],
          ellipse: null,
          transform: null,
        }
        for (let item of data.it) {
          this._traverseShape(item, parentId, parentWidth, parentHeight, id, d)
        }
        this.actions.createShape(id, parentId, d.stroke.width)
        d.shape.forEach((item: any[]) => {
          this.actions.drawCubicBezier(
            id,
            item[0],
            item[1],
            item[2],
            item[3],
            d.stroke.width,
            d.stroke.color,
          )
        })
        if (d.ellipse) {
          let [x, y] = d.transform.p.k
          const center = { x, y: -y }
          const [rx, ry] = d.ellipse.s.k
          this.actions.drawEllipse(
            id,
            center,
            rx,
            ry,
            0,
            100,
            true,
            d.stroke.width,
            d.stroke.color,
            d.fill.color,
          )
        }

        break
        // options.curveAnimate(id, 10, { r: 255, g: 0, b: 0, a: 255 }, d.data)
      }
      case Shape.stroke: {
        if (id) {
          d.stroke = {
            width: data.w.k,
            color: convertColor(data.c.k),
          }
        }
        break
      }
      case Shape.shape: {
        if (id && d) {
          const c = (x: any) => {
            const { i, o, v } = x
            d.data = []
            for (let j = 0; j < v.length - 1; j++) {
              d.data.push([
                { x: v[j][0], y: parentHeight - v[j][1] },
                { x: v[j][0] + o[j][0], y: parentHeight - v[j][1] - o[j][1] },
                {
                  x: v[j + 1][0] + i[j + 1][0],
                  y: parentHeight - v[j + 1][1] - i[j + 1][1],
                },
                { x: v[j + 1][0], y: parentHeight - v[j + 1][1] },
              ])
            }
          }
          if (data.ks) {
            if (Array.isArray(data.ks.k)) {
              c(data.ks.k[0].s[0])
              // animation
              // FIXME: shape animation
              // d.data = data.ks.k[0]
            } else {
              c(data.ks.k)
            }
          }
        }
        break
      }
      case Shape.transform:
        d.transform = data
        break
      case Shape.ellipse:
        d.ellipse = data
        break
      case Shape.fill:
        d.fill = {
          color: convertColor(data.c.k),
          opacity: data.o.k,
        }
        break
      case Shape.merge:
        break
      default:
        console.log(data.ty)
    }
  }

  parseKeyframe(keyframes: Keyframe[]) {
    let nextTime = null
    let result = []

    for (let i = keyframes.length - 1; i >= 0; i--) {
      const { s, e, to, ti, t } = keyframes[i]
      if (s) {
        result.unshift({
          s,
          e,
          to,
          ti,
          t: this.getTime(nextTime - t),
          startTime: i === 0 ? this.getTime(t) : 0,
        })
      }
      nextTime = t
    }
    // console.log(result)

    return result
  }

  _applyTransform(
    layer: any,
    id: string,
    parentId: string,
    width: number,
    height: number,
    parentWidth: number,
    parentHeight: number,
    st: number,
    options: Actions,
  ) {
    // Opacity
    if (layer.ks.o) {
      console.log(layer.nm)
      const { k } = layer.ks.o
      if (typeof k === 'number') {
        options.setOpacity(id, k * 2.55)
      } else if (k.length) {
        const opacity = k[0].s[0]
        options.setOpacity(id, opacity * 2.55)
        options.setOpacityAnimation(id, this.parseKeyframe(k), this.getTime(st))
      }
    }

    // anchor
    if (layer.ks.a && layer.ks.a.k) {
      const [x, y] = layer.ks.a.k
      if (typeof x === 'number' && typeof y === 'number') {
        options.setAnchor(id, x / width, 1 - y / height)
      } else {
        console.log('Anchor error: ', id, layer.ks.a)
      }
    }

    // position
    if (layer.ks.p) {
      const { k } = layer.ks.p
      if (typeof k[0] === 'number') {
        var [x, y] = k
        options.setPosition(id, x, parentHeight - y)
      } else if (k.length) {
        const [x, y] = k[0].s
        options.setPosition(id, x, parentHeight - y)
        options.setPositionAnimation(
          id,
          this.parseKeyframe(k),
          this.getTime(st),
          parentHeight,
        )
      }
    }

    // rotation
    if (layer.ks.r && layer.ks.r.k) {
      const { k } = layer.ks.r
      if (typeof k === 'number') {
        options.setRotation(id, k)
      } else if (typeof k[0] === 'number') {
        options.setRotation(id, k[0])
      } else {
        options.setRotation(id, k[0].s[0])
        options.setRotationAnimatation(
          id,
          this.parseKeyframe(k),
          this.getTime(st),
        )
      }
    }

    // scale
    if (layer.ks.s) {
      const { k } = layer.ks.s
      if (typeof k[0] === 'number') {
        const [x, y] = k
        options.setScale(id, x / 100, y / 100)
      } else {
        const [x, y] = k[0].s
        options.setScale(id, x / 100, y / 100)
        options.setScaleAnimatation(id, this.parseKeyframe(k), this.getTime(st))
      }
    }
  }

  _traverseLayer(
    layer: any,
    parentId: string,
    options: Actions,
    st: number,
    parentWidth: number,
    parentHeight: number,
  ) {
    // console.log(layer.nm)

    switch (layer.ty) {
      case Layer.shape: {
        const id = genId()
        // same width and height as parent
        // options.createLayer(id, parentWidth, parentHeight)
        options.createPrecomp(id, 0, 0)
        this._applyTransform(
          layer,
          id,
          parentId,
          parentWidth,
          parentHeight,
          parentWidth,
          parentHeight,
          st,
          options,
        )
        options.appendChild(id, parentId)
        for (let shape of layer.shapes) {
          this._traverseShape(shape, id, parentWidth, parentHeight)
        }
        break
      }
      case Layer.solid: {
        break
      }
      case Layer.image: {
        const id = layer.refId
        const asset = this.assets[id]
        if (!asset) break
        // TODO: sprite frame
        options.createImage(id, asset.u, asset.p, asset.w, asset.h)
        options.setContentSize(id, asset.w, asset.h)
        options.appendChild(id, parentId)
        this._applyTransform(
          layer,
          id,
          parentId,
          asset.w,
          asset.h,
          parentWidth,
          parentHeight,
          st,
          options,
        )

        break
      }
      case Layer.null:
      case Layer.precomp: {
        const id = genId(layer.refId)
        layer.xid = id

        const getLayerWidthAndHeight = (l: any) => {
          if (l.ty === Layer.null) {
            // FIXME: Assume null layer's width and height
            return l.ks.a.k.map((x: number) => x * 2)
          } else {
            return [l.w, l.h]
          }
        }
        const [width, height] = getLayerWidthAndHeight(layer)
        options.createPrecomp(id, width, height)

        this._applyTransform(
          layer,
          id,
          parentId,
          width,
          height,
          parentWidth,
          parentHeight,
          st,
          options,
        )

        // effects
        if (layer.ef) {
          for (let item of layer.ef) {
            // _traverseEffect(item, parentId)
          }
        }

        const asset = this.assets[layer.refId]
        if (asset && asset.layers) {
          // FIXME: parent before child
          const sortedLayers = []
          const indexIdMapping: any = {}
          for (let l of asset.layers) {
            if (l.parent) {
              sortedLayers.push(l)
            } else {
              sortedLayers.unshift(l)
            }
            if (l.ind) {
              indexIdMapping[l.ind] = l
            }
          }

          for (let l of sortedLayers) {
            let correctId, parentWidth, parentHeight
            if (l.parent) {
              const parent = indexIdMapping[l.parent]
              correctId = parent.xid
              ;[parentWidth, parentHeight] = getLayerWidthAndHeight(parent)
            } else {
              correctId = id
              parentWidth = width
              parentHeight = height
            }

            this._traverseLayer(
              l,
              correctId,
              options,
              st + (layer.st || 0),
              parentWidth,
              parentHeight,
            )
          }
        }

        options.appendChild(id, parentId)
        break
      }
    }
  }
}
