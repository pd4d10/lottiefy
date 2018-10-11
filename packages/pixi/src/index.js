import { LottieRenderer } from 'lottiefy'
import { degToRad, bezier, linear } from './utils'

const nodes = {}
const actions = []

const addAction = payload => {
  actions.push(payload)
}

export default class LottiePixi {
  constructor({ data }) {
    let container = new PIXI.Container()
    nodes['xxx'] = container
    container.width = data.w
    container.height = data.h
    app.stage.addChild(container)

    this.renderer = new LottieRenderer({
      data,
      containerId: 'xxx',
      actions: {
        createPrecomp(id, { width, height }) {
          nodes[id] = new PIXI.Container()
          nodes[id].width = width
          nodes[id].height = height
        },
        createImage(id, { path, name, width, height }) {
          nodes[id] = new PIXI.Sprite(
            PIXI.loader.resources[path + name].texture,
          )
          nodes[id].width = width
          nodes[id].height = height
        },
        show(id) {
          nodes[id].visible = true
        },
        hide(id) {
          nodes[id].visible = false
        },
        delayShow(id, delay) {
          nodes[id].visible = true
        },
        appendChild(id, parentId) {
          nodes[parentId].addChild(nodes[id])
        },
        setOpacity(id, { opacity }) {
          nodes[id].alpha = opacity / 100
        },
        setPosition(id, { x, y }) {
          nodes[id].position.set(x, y)
        },
        setContentSize(id, { width, height }) {
          nodes[id].width = width
          nodes[id].height = height
        },
        setScale(id, { x, y }) {
          nodes[id].scale.set(x / 100, y / 100)
        },
        setAnchor(id, { ax, ay }) {
          nodes[id].pivot.x = ax
          nodes[id].pivot.y = ay
        },
        setRotation(id, { rotation }) {
          nodes[id].rotation = degToRad(rotation)
        },
        setOpacityAnimation(id, data) {
          let t = 0
          let startM
          data.forEach(item => {
            addAction({
              id,
              start: item.delay + t,
              duration: item.duration,
              action: () => {
                const now = performance.now()
                if (!startM) startM = now
                nodes[id].alpha = linear(
                  item.start[0] / 100,
                  item.end[0] / 100,
                  (ratio * (now - startM)) / 1000 / item.duration,
                )
              },
            })
            t += item.duration + item.delay
            startM = null
          })
        },
        setRotationAnimatation(id, data) {
          let t = 0
          let startM
          data.forEach(item => {
            addAction({
              id,
              start: item.delay + t,
              duration: item.duration,
              action: () => {
                const now = performance.now()
                if (!startM) startM = now
                nodes[id].rotation = linear(
                  degToRad(item.start[0]),
                  degToRad(item.end[0]),
                  (now - startM) / 1000 / item.duration,
                )
              },
            })
            t += item.duration + item.delay
            startM = null
          })
        },
        setPositionAnimation(id, data) {
          let t = 0
          let startM
          data.forEach(item => {
            addAction({
              id,
              start: item.delay + t,
              duration: item.duration,
              action: () => {
                const now = performance.now()
                if (!startM) startM = now
                const { x, y } = bezier(
                  item.points,
                  (now - startM) / 1000 / item.duration,
                )
                // console.log(y)
                nodes[id].x = x
                nodes[id].y = y
              },
            })
            t += item.duration + item.delay
            startM = null
          })
        },
        setScaleAnimatation(id, data) {
          let t = 0
          let startM
          data.forEach(item => {
            addAction({
              id,
              start: item.delay + t,
              duration: item.duration,
              action: () => {
                const now = performance.now()
                if (!startM) startM = now
                nodes[id].scale.set(
                  linear(
                    item.start[0] / 100,
                    item.end[0] / 100,
                    (now - startM) / 1000 / item.duration,
                  ),
                  linear(
                    item.start[1] / 100,
                    item.end[1] / 100,
                    (now - startM) / 1000 / item.duration,
                  ),
                )
              },
            })
            t += item.duration + item.delay
            startM = null
          })
        },
      },
    })
  }

  run() {
    this.renderer.generateAnimations()
    actions.forEach(({ id, start, duration, action }) => {
      setTimeout(() => {
        app.ticker.add(action)
        setTimeout(() => {
          app.ticker.remove(action)
        }, duration * 1000)
      }, start * 1000)
    })
  }
}
