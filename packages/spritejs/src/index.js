import { LottieRenderer } from 'lottiefy'

export default function loadAnimation({ animationData, container }) {
  const nodes = {}
  const actions = []

  const containerId = 'xxx'
  nodes[containerId] = container

  const renderer = new LottieRenderer({
    data: animationData,
    containerId,
    actions: {
      createPrecomp(id, { width, height }) {
        nodes[id] = new spritejs.Group({
          size: [width, height],
        })
      },
      createImage(id, { path, name, width, height }) {
        nodes[id] = new spritejs.Sprite(path + name)
        // nodes[id].attr({
        //   size: [width, height],
        // })
      },
      show(id) {
        // nodes[id].setVisible(true)
      },
      hide(id) {
        // nodes[id].setVisible(false)
      },
      delayShow(id, timeout) {
        // addAction(id, cc.sequence([cc.delayTime(timeout), cc.show()]))
      },
      setPosition(id, { x, y }) {
        nodes[id].attr({ pos: [x, y] })
      },
      setPositionAnimation(id, data) {
        // const sequenceActions = []
        // data.forEach(item => {
        //   sequenceActions.push(
        //     cc.delayTime(item.delay),
        //     cc.moveTo(0, item.points[0]),
        //     cc.bezierTo(item.duration, item.points.slice(1)),
        //   )
        // })
        // addAction(id, cc.sequence(sequenceActions))
        data.forEach(item => {
          actions.push(new Promise(resolve => {}))
          nodes[id].animate(
            [
              { x: item.points[0].x, y: item.points[0].y },
              {
                x: item.points[3].x,
                y: item.points[3].y,
              },
            ],
            {
              delay: item.delay * 1000,
              duration: item.duration * 1000,
            },
          )
        })
      },
      setRotation(id, { rotation }) {
        nodes[id].attr({ rotate: rotation })
      },
      setRotationAnimatation(id, data) {
        // const sequenceActions = []
        // data.forEach(item => {
        //   sequenceActions.push(
        //     cc.delayTime(item.delay),
        //     cc.rotateTo(0, item.start[0]),
        //     cc.rotateTo(item.duration, item.end[0]),
        //   )
        // })
        // addAction(id, cc.sequence(sequenceActions))
      },
      setScale(id, { x, y }) {
        nodes[id].attr({ scale: [x / 100, y / 100] })
      },
      setScaleAnimatation(id, data) {
        // const sequenceActions = [cc.delayTime(0)]
        // data.forEach(item => {
        //   sequenceActions.push(
        //     cc.delayTime(item.delay),
        //     cc.scaleTo(0, item.start[0] / 100, item.start[1] / 100),
        //     cc.scaleTo(item.duration, item.end[0] / 100, item.end[1] / 100),
        //   )
        // })
        // addAction(id, cc.sequence(sequenceActions))
      },
      setOpacity(id, { opacity }) {
        // nodes[id].attr(opacity * 2.55)
      },
      setOpacityAnimation(id, data) {
        // const sequenceActions = [cc.delayTime(0)]
        // data.forEach(item => {
        //   sequenceActions.push(
        //     cc.delayTime(item.delay),
        //     cc.fadeTo(0, item.start[0] * 2.55),
        //     cc.fadeTo(item.duration, item.end[0] * 2.55),
        //   )
        // })
        // addAction(id, cc.sequence(sequenceActions))
      },
      setAnchor(id, { rx, ry }) {
        nodes[id].attr({ anchor: [rx, ry] })
      },
      appendChild(id, parentId) {
        nodes[parentId].append(nodes[id])
      },
    },
  })

  renderer.generateAnimations()
}
