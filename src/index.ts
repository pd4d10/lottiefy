/// <reference path="../typings/cocos2d/cocos2d-lib.d.ts" />
import { Layers, Assets } from '../typings/animation'
import { Color } from './types'
import { traverse } from './traverse'

export default function lottie(data: any, g: any) {
  const layers: { [id: string]: cc.Layer | cc.Sprite | cc.DrawNode } = {}

  const container = new cc.LayerColor(cc.color(0, 0, 50, 100), data.w, data.h)
  // container.setScale(0.5)
  const containerId = 'xxxxx'
  layers[containerId] = container
  g.addChild(container)
  ;(window as any).c = container

  traverse(data, containerId, false, {
    createPrecomp(id, width, height) {
      layers[id] = new cc.LayerColor(cc.color(255, 255, 0, 30), width, height)
      // layers[id] = new cc.LayerColor(cc.color(0, 0, 0, 0), width, height)
    },
    createImage(id, name) {
      // layers[id] = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(name))
      layers[id] = new cc.Sprite(name)
    },
    setPosition(id, x, y) {
      layers[id].setPosition(x, y)
    },
    setPositionAnimation(id, data, delay, parentHeight) {
      const a: any[] = []
      data.forEach((x: any) => {
        a.push(
          cc.moveTo(x.startTime, cc.p(x.s[0], parentHeight - x.s[1])),
          cc.bezierTo(x.t, [
            cc.p(x.s[0] + x.to[0], parentHeight - (x.s[1] + x.to[1])),
            cc.p(x.ti[0] + x.e[0], parentHeight - (x.ti[1] + x.e[1])),
            cc.p(x.e[0], parentHeight - x.e[1]),
          ]),
        )
      })
      a.unshift(cc.delayTime(delay))
      layers[id].runAction(cc.sequence(a))
    },
    setRotation(id, rotation) {
      layers[id].setRotation(rotation)
    },
    setRotationAnimatation(id, data, delay) {
      let a: any = []
      data.forEach((x: any) => {
        a.push(cc.rotateTo(x.startTime, x.s[0]), cc.rotateTo(x.t, x.e[0]))
      })
      a.unshift(cc.delayTime(delay))
      layers[id].runAction(cc.sequence(a))
    },
    setScale(id, x, y) {
      layers[id].setScale(x, y)
    },
    setScaleAnimatation(id, data, delay) {
      let a: any = []
      data.forEach((x: any) => {
        a.push(cc.scaleTo(x.startTime, x.s[0] / 100, x.s[1] / 100), cc.scaleTo(x.t, x.e[0] / 100, x.e[1] / 100))
      })
      a.unshift(cc.delayTime(delay))
      layers[id].runAction(cc.sequence(a))
    },
    setContentSize(id, width, height) {
      layers[id].setContentSize(width, height)
    },
    setAnchorPoint(id, x, y) {
      layers[id].ignoreAnchorPointForPosition(false)
      layers[id].setAnchorPoint(x, y)
    },
    moveTo(id, parentId, time, x, y) {
      // console.log(layers[parentId])
      layers[id].runAction(cc.moveTo(time, x, layers[parentId].height - y))
    },
    appendChild(id, parentId, localZOrder) {
      // console.log(arguments)
      // layers[id].ignoreAnchorPointForPosition(false)
      layers[parentId].addChild(layers[id], localZOrder)
    },
    getNodeById(id) {
      return layers[id]
    },
    setOpacity(id, opacity) {
      // layers[id].setCascadeOpacityEnabled(true)
      // layers[id].setOpacity(opacity)
    },
    setOpacityAnimation(id, data, delay) {
      let a: any = []
      data.forEach((x: any) => {
        a.push(cc.fadeTo(x.startTime, x.s[0] * 2.55), cc.fadeTo(x.t, x.e[0] * 2.55))
      })
      a.unshift(cc.delayTime(delay))
      layers[id].runAction(cc.sequence(a))
    },

    createDrawNode(id, parentId) {
      // console.log(id)
      layers[id] = new cc.DrawNode()
      this.appendChild(id, parentId)
    },
    drawCubicBezier(id, origin, c1, c2, dest, width, color) {
      let node = layers[id] as cc.DrawNode
      node.drawCubicBezier(origin, c1, c2, dest, 100, width, cc.color.apply(null, color))
    },
    drawEllipse(id, ...args) {
      function drawEllipse(
        center: cc.Point,
        rx: number,
        ry: number,
        angle: number,
        segments: number,
        drawLineToCenter: boolean,
        lineWidth: number,
        color: Color,
        fillColor: Color,
      ) {
        let _vertices = []
        let _from: any = {}
        let _to: any = {}
        lineWidth = lineWidth || this._lineWidth
        // color = color || this._drawColor
        color = cc.color.apply(null, color)
        fillColor = cc.color.apply(null, fillColor)
        var coef = 2.0 * Math.PI / segments,
          i,
          len
        _vertices.length = 0
        for (i = 0; i <= segments; i++) {
          var rads = i * coef
          var j = rx * Math.cos(rads + angle) / 2 + center.x
          var k = ry * Math.sin(rads + angle) / 2 + center.y
          _vertices.push(j, k)
        }
        if (drawLineToCenter) _vertices.push(center.x, center.y)

        // lineWidth *= 0.5
        this.drawPoly(_vertices, fillColor, lineWidth, color)
        _vertices.length = 0
      }

      drawEllipse.apply(layers[id], args)
    },
    curveAnimate(id, width, [r, g, b, a], config) {
      const C = (cc.ActionInterval as any).extend({
        // _config: any = null
        // _p: any
        // _computeEaseTime: any

        // ctor(t?: number, c?: any) {
        //   if (!c) { return }
        //   this._config = c
        //   cc.ActionInterval.prototype.ctor.call(this)
        //   c && this.initWithDuration(t, c)
        // }

        // initWithDuration(t?: number, c?: any[]) {
        //   if (cc.ActionInterval.prototype.initWithDuration.call(this, t)) {
        //     this._config = c
        //     return true
        //   }
        //   return false
        // }

        // startWithTarget(target: any) {
        //   cc.ActionInterval.prototype.startWithTarget.call(this, target)
        //   this._p = this._config.s[0]
        //   const { v, i, o } = this._config.s[0]
        //   let d = []
        //   for (let j = 0; j < v.length - 1; j++) {
        //     d.push([
        //       { x: v[j][0], y: v[j][1] },
        //       { x: v[j][0] + o[j][0], y: v[j][1] + o[j][1] },
        //       {
        //         x: v[j + 1][0] + i[j + 1][0],
        //         y: v[j + 1][1] + i[j + 1][1],
        //       },
        //       { x: v[j + 1][0], y: v[j + 1][1] },
        //     ])
        //   }
        //   d.forEach(item => {
        //     target.drawCubicBezier(...item, 100, 10, cc.color(255, 0, 0, 255))
        //   })
        // }

        update(dt: number) {
          dt = this._computeEaseTime(dt)
          console.log(this._p)
          if (this.target) {
            const target = this.target as cc.DrawNode
            target.clear()
            const newPosition = {
              i: this._p.s[0].i.map((dots: [number, number], idx: number) => {
                return [(dots[0] + this._config.e[0].i[idx][0]) / 2, (dots[1] + this._config.e[0].i[idx][1]) / 2]
              }),
              o: this._p.s[0].o.map((dots: [number, number], idx: number) => {
                return [(dots[0] + this._config.e[0].o[idx][0]) / 2, (dots[1] + this._config.e[0].o[idx][1]) / 2]
              }),
              v: this._p.s[0].v.map((dots: [number, number], idx: number) => {
                return [(dots[0] + this._config.e[0].v[idx][0]) / 2, (dots[1] + this._config.e[0].v[idx][1]) / 2]
              }),
            }
            this._p = newPosition
            const { v, i, o } = newPosition
            let d = []
            for (let j = 0; j < v.length - 1; j++) {
              d.push([
                { x: v[j][0], y: v[j][1] },
                { x: v[j][0] + o[j][0], y: v[j][1] + o[j][1] },
                {
                  x: v[j + 1][0] + i[j + 1][0],
                  y: v[j + 1][1] + i[j + 1][1],
                },
                { x: v[j + 1][0], y: v[j + 1][1] },
              ])
            }
            d.forEach(item => {
              target.drawCubicBezier(item[0], item[1], item[2], item[3], 100, 10, cc.color(255, 0, 0, 255))
            })
          }
        },
      })

      const x = new C(10)
      x.startWithTarget(layers[id])
    },
  })
}
