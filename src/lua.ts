// lua code generator
// TODO: use ast

import { traverse } from './traverse'
import { Color } from './types'

export function lua(data: any, containerId: string) {
  let code = ''

  const append = (str: string) => {
    code += str + '\n'
  }

  const convertPoint = (points: cc.Point[]) => {
    return points.map(p => `cc.p(${p.x}, ${p.y})`).join(',')
  }

  const convertColor = ({ r, g, b, a }: Color) => {
    return `cc.c4f(${r}, ${g}, ${b}, ${a})`
  }

  traverse(data, containerId, true, {
    createLayer(id, width, height) {
      append(`local ${id} = cc.Layer:create()`)
      append(`${id}:setContentSize(${width}, ${height})`)
    },
    createSprite(id, name) {
      append(`local ${id} = display.newSprite("#${name}")`)
    },
    setPosition(id, x, y) {
      append(`${id}:setPosition(cc.p(${x}, ${y}))`)
    },
    positionAnimate(id, data, delay, parentHeight) {
      const a: any[] = []
      data.forEach((x: any) => {
        a.push(
          `cc.MoveTo:create(${x.startTime}, cc.p(${x.s[0]}, ${parentHeight -
            x.s[1]}))`,
          `cc.BezierTo:create(${x.t}, {
            cc.p(${x.s[0] + x.to[0]}, ${parentHeight - (x.s[1] + x.to[1])}),
            cc.p(${x.ti[0] + x.e[0]}, ${parentHeight - (x.ti[1] + x.e[1])}),
            cc.p(${x.e[0]}, ${parentHeight - x.e[1]}),
          })`,
        )
      })
      a.unshift(`cc.DelayTime:create(${delay})`)
      append(
        `table.insert(data, {node=${id},action=cc.Sequence:create({${a.join(
          ',',
        )}})})`,
      )
    },
    setRotation(id, rotation) {
      append(`${id}:setRotation(${rotation})`)
    },
    rotationAnimate(id, data, delay) {
      let a: any = []
      data.forEach((x: any) => {
        a.push(
          `cc.RotateTo:create(${x.startTime}, ${x.s[0]})`,
          `cc.RotateTo:create(${x.t}, ${x.e[0]})`,
        )
      })
      a.unshift(`cc.DelayTime:create(${delay})`)
      append(
        `table.insert(data, {node=${id},action=cc.Sequence:create({${a.join(
          ',',
        )}})})`,
      )
    },
    setScale(id, x, y) {
      append(`${id}:setScaleX(${x})`)
      append(`${id}:setScaleY(${y})`)
    },
    scaleAnimate(id, data, delay) {
      let a: any = []
      data.forEach((x: any) => {
        a.push(
          `cc.ScaleTo:create(${x.startTime}, ${x.s[0] / 100}, ${x.s[1] / 100})`,
          `cc.ScaleTo:create(${x.t}, ${x.e[0] / 100}, ${x.e[1] / 100})`,
        )
      })
      a.unshift(`cc.DelayTime:create(${delay})`)
      append(
        `table.insert(data, {node=${id},action=cc.Sequence:create({${a.join(
          ',',
        )}})})`,
      )
    },
    setContentSize(id, width, height) {
      append(`${id}:setContentSize(${width}, ${height})`)
    },
    setAnchorPoint(id, x, y) {
      append(`${id}:ignoreAnchorPointForPosition(false)
    ${id}:setAnchorPoint(cc.p(${x}, ${y}))`)
    },
    moveTo(id, parentId, time, x, y) {},
    addChild(id, parentId, localZOrder) {
      append(`${parentId}:addChild(${id})`)
    },
    getNode(id) {},

    setOpacity(id, opacity) {
      append(`${id}:setOpacity(${opacity})`)
    },
    fadeTo(id, data, delay) {
      let a: any = []
      data.forEach((x: any) => {
        a.push(
          `cc.FadeTo:create(${x.startTime}, ${x.s[0] * 2.55})`,
          `cc.FadeTo:create(${x.t}, ${x.e[0] * 2.55})`,
        )
      })
      a.unshift(`cc.DelayTime:create(${delay})`)
      append(
        `table.insert(data, {node=${id},action=cc.Sequence:create({${a.join(
          ',',
        )}})})`,
      )
    },
    createDrawNode(id, parentId, width) {
      append(`local ${id} = cc.DrawNode:create(${width})`)
      append(`${parentId}:addChild(${id})`)
    },
    drawCubicBezier(id, origin, c1, c2, dest, width, color) {
      append(
        `${id}:drawCubicBezier(${convertPoint([
          origin,
          c1,
          c2,
          dest,
        ])}, 100, ${convertColor(color)})`,
      )
    },
  })

  return code
}
