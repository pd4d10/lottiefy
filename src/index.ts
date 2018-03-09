/// <reference path="../typings/cocos2d/cocos2d-lib.d.ts" />
import { Layers, Assets } from '../typings/animation'
import { traverse } from './traverse'

export default function lottie(data: any, g: any) {
  const layers: { [id: string]: cc.Layer | cc.Sprite } = {}

  const container = new cc.LayerColor(cc.color(0, 0, 0, 0), 0, 0)
  // container.ignoreAnchorPointForPosition(false)
  // container.setAnchorPoint(0.5, 0.5)
  // container.setPosition(0, cc.winSize.height)
  container.setPosition(400, 400)
  // window.g = globalLayer
  container.setScale(cc.winSize.height / 1920)
  const containerId = 'xxxxx'
  layers[containerId] = container
  g.addChild(container)

  traverse(data, containerId, {
    createLayer(id) {
      layers[id] = new cc.LayerColor(cc.color(0, 0, 0, 0))
    },
    createSprite(id, name) {
      // layers[id] = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(name))
      layers[id] = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(name))
    },
    setPosition(id, parentId, x, y) {
      layers[id].setPosition(x, layers[parentId].height - y)
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
    addChild(id, parentId) {
      layers[parentId].addChild(layers[id])
    },
  })
}
