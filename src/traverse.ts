import { v4 } from 'uuid'
import {
  Actions,
  Layer,
  Shape,
  Effect,
  Color,
  Keyframe,
  Point,
  BezierPoints,
  PositionAnimationData,
} from './types'

const genId = (nm?: string) => {
  return (nm || 'v') + '_' + v4().replace(/-/g, '_') // for lua variables
}

function convertColor(c: Color) {
  return c.map(n => n * 255)
}

export default class LottieRenderer {
  data: any // JSON data exported by Bodymovin
  containerId: string // Container
  actions: Actions
  assets: { [id: string]: any }

  /**
   * Some engine like Cocos2dx's Y coordinate
   */
  reverseY = false

  _getCorrectY(y: number, parentHeight: number) {
    return this.reverseY ? parentHeight - y : y
  }

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

    // Convert assets to a map for easily accessing
    this.assets = {}
    for (let asset of data.assets) {
      if (asset.id) {
        this.assets[asset.id] = asset
      }
    }
  }

  generateAnimations() {
    for (let layer of this.data.layers) {
      this._traverseLayer(layer, this.containerId, 0, this.data.w, this.data.h)
    }
  }

  _applyAnchor(layer: any, id: string, width: number, height: number) {}

  // _traverseEffect(data: any, parentId: string, node: cc.DrawNode) {
  //   switch (data.ty) {
  //     case Effect.group: {
  //       if (data.mn === 'ADBE Gaussian Blur 2') {
  //       }
  //       for (let item of data.ef) {
  //         this._traverseEffect(item, parentId, node)
  //       }
  //     }
  //     case Effect.dropDown: {
  //     }
  //   }
  // }

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
                {
                  x: v[j][0],
                  y: this._getCorrectY(v[j][1], parentHeight),
                },
                {
                  x: v[j][0] + o[j][0],
                  y: this._getCorrectY(v[j][1] + o[j][1], parentHeight),
                },
                {
                  x: v[j + 1][0] + i[j + 1][0],
                  y: this._getCorrectY(v[j + 1][1] + i[j + 1][1], parentHeight),
                },
                {
                  x: v[j + 1][0],
                  y: this._getCorrectY(v[j + 1][1], parentHeight),
                },
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

  parseBezier(result: any[], offset: number, parentHeight: number) {
    const a: PositionAnimationData[] = []
    a = result.map(item => {
      // console.log(item)
      return {
        delay: item.startTime,
        duration: item.t,
        points: [
          {
            x: item.s[0],
            y: this._getCorrectY(item.s[1], parentHeight),
          },
          {
            x: item.s[0] + item.to[0],
            y: this._getCorrectY(item.s[1] + item.to[1], parentHeight),
          },
          {
            x: item.ti[0] + item.e[0],
            y: this._getCorrectY(item.ti[1] + item.e[1], parentHeight),
          },
          { x: item.e[0], y: this._getCorrectY(item.e[1], parentHeight) },
        ],
      }
    })
    return a
  }

  parseKeyframe(keyframes: Keyframe[], offset: number, parentHeight: number) {
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
  ) {
    // Opacity
    if (layer.ks.o) {
      console.log(layer.nm)
      const { k } = layer.ks.o
      if (typeof k === 'number') {
        this.actions.setOpacity(id, k * 2.55)
      } else if (k.length) {
        const opacity = k[0].s[0]
        this.actions.setOpacity(id, opacity * 2.55)
        this.actions.setOpacityAnimation(
          id,
          this.parseKeyframe(k, st, parentHeight),
          this.getTime(st),
        )
      }
    }

    // Anchor
    if (layer.ks.a && layer.ks.a.k) {
      const [x, y] = layer.ks.a.k
      if (typeof x === 'number' && typeof y === 'number') {
        this.actions.setAnchor(
          id,
          x / width,
          this._getCorrectY(y, height) / height,
        )
      } else {
        console.log('Anchor error: ', id, layer.ks.a)
      }
    }

    // position
    if (layer.ks.p) {
      const { k } = layer.ks.p
      if (typeof k[0] === 'number') {
        var [x, y] = k
        this.actions.setPosition(id, x, this._getCorrectY(y, parentHeight))
      } else if (k.length) {
        const [x, y] = k[0].s
        this.actions.setPosition(id, x, this._getCorrectY(y, parentHeight))
        this.actions.setPositionAnimation(
          id,
          this.parseBezier(
            this.parseKeyframe(k, st, parentHeight),
            st,
            parentHeight,
          ),
          this.getTime(st),
        )
      }
    }

    // rotation
    if (layer.ks.r && layer.ks.r.k) {
      const { k } = layer.ks.r
      if (typeof k === 'number') {
        this.actions.setRotation(id, k)
      } else if (typeof k[0] === 'number') {
        this.actions.setRotation(id, k[0])
      } else {
        this.actions.setRotation(id, k[0].s[0])
        this.actions.setRotationAnimatation(
          id,
          this.parseKeyframe(k, st, parentHeight),
          this.getTime(st),
        )
      }
    }

    // scale
    if (layer.ks.s) {
      const { k } = layer.ks.s
      if (typeof k[0] === 'number') {
        const [x, y] = k
        this.actions.setScale(id, x / 100, y / 100)
      } else {
        const [x, y] = k[0].s
        this.actions.setScale(id, x / 100, y / 100)
        this.actions.setScaleAnimatation(
          id,
          this.parseKeyframe(k, st, parentHeight),
          this.getTime(st),
        )
      }
    }
  }

  _traverseLayer(
    layer: any,
    parentId: string,
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
        this.actions.createPrecomp(id, 0, 0)
        this._applyTransform(
          layer,
          id,
          parentId,
          parentWidth,
          parentHeight,
          parentWidth,
          parentHeight,
          st,
        )
        this.actions.appendChild(id, parentId)
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
        this.actions.createImage(id, asset.u, asset.p, asset.w, asset.h)
        this.actions.setContentSize(id, asset.w, asset.h)
        this.actions.appendChild(id, parentId)
        this._applyTransform(
          layer,
          id,
          parentId,
          asset.w,
          asset.h,
          parentWidth,
          parentHeight,
          st,
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
        this.actions.createPrecomp(id, width, height)

        this._applyTransform(
          layer,
          id,
          parentId,
          width,
          height,
          parentWidth,
          parentHeight,
          st,
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
              st + (layer.st || 0),
              parentWidth,
              parentHeight,
            )
          }
        }

        this.actions.appendChild(id, parentId)
        break
      }
    }
  }
}
