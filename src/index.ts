/// <reference path="../typings/cocos2d/cocos2d-lib.d.ts" />
import { Layers, Assets } from '../typings/animation'
import { traverse } from './traverse'

export default function lottie(data: any, g: any) {
  const layers: { [id: string]: cc.Layer | cc.Sprite | cc.DrawNode } = {}

  // const container = new cc.LayerColor(cc.color(0, 0, 255, 100), 1080, 1920)
  const container = new cc.LayerColor(cc.color(0, 0, 0, 0), 1080, 1920)
  // container.setContentSize(100, 100)
  // container.ignoreAnchorPointForPosition(false)
  // container.setAnchorPoint(0.5, 0.5)

  // container.setPosition(0, cc.winSize.height)
  // container.setPosition(cc.winSize.width / 2, cc.winSize.height / 2)
  // container.setScale(0.4)
  // container.setPosition(500, 500)
  // window.g = globalLayer
  // container.setScale(cc.winSize.height / 1920)
  const containerId = 'xxxxx'
  layers[containerId] = container
  g.addChild(container)
  ;(window as any).c = container
  let ii = 0

  traverse(data, containerId, {
    createLayer(id, width, height) {
      // layers[id] = new cc.LayerColor(cc.color(255, 255, 0, 40), width, height)
      layers[id] = new cc.LayerColor(cc.color(0, 0, 0, 0), width, height)
    },
    createSprite(id, name) {
      // layers[id] = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(name))
      layers[id] = new cc.Sprite(name)
    },
    setPosition(id, x, y) {
      layers[id].setPosition(x, y)
    },
    positionAnimate(id, data, delay, parentHeight) {
      const a: any[] = []
      data.forEach((x: any) => {
        a.push(
          cc.moveTo(x.startTime, cc.p(x.s[0], parentHeight - x.s[1])),
          cc.bezierTo(x.t, [
            cc.p(x.s[0] + x.to[0], parentHeight - (x.s[1] + x.to[1])),
            cc.p(x.ti[0] + x.e[0], parentHeight - (x.ti[1] + x.e[1])),
            cc.p(x.e[0], parentHeight - x.e[1]),
          ])
        )
      })
      a.unshift(cc.delayTime(delay))
      layers[id].runAction(cc.sequence(a))
    },
    setRotation(id, rotation) {
      layers[id].setRotation(rotation)
    },
    rotationAnimate(id, data, delay) {
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
    scaleAnimate(id, data, delay) {
      let a: any = []
      data.forEach((x: any) => {
        a.push(
          cc.scaleTo(x.startTime, x.s[0] / 100, x.s[1] / 100),
          cc.scaleTo(x.t, x.e[0] / 100, x.e[1] / 100)
        )
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
    addChild(id, parentId, localZOrder) {
      // console.log(arguments)
      // layers[id].ignoreAnchorPointForPosition(false)
      layers[parentId].addChild(layers[id], localZOrder)
    },
    getNode(id) {
      return layers[id]
    },

    createDrawNode(id, parentId) {
      layers[id] = new cc.DrawNode()
      this.addChild(id, parentId)
    },
    drawCubicBezier(id, origin, c1, c2, dest, width, { r, g, b, a }) {
      let node = layers[id] as cc.DrawNode
      node.drawCubicBezier(origin, c1, c2, dest, 100, width, cc.color(r, g, b, a))
    },
  })
}
