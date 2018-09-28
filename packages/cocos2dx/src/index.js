import { LottieRenderer } from 'lottiefy'

export function loadAnimation({ animationData, container, speed }) {
  const nodes = {}
  const actions = []

  function addAction(id, action) {
    actions.push({ id, action })
  }

  // const container = new cc.LayerColor(cc.color(40, 40, 0, 100), data.w, data.h)
  const c = new cc.Layer()
  c.setContentSize(animationData.w, animationData.h)
  // container.setScale(0.3)
  const containerId = 'xxxxxx' // TODO: random id
  nodes[containerId] = c
  container.addChild(c)
  // window.c = c
  var useSpriteFrame = false

  const renderer = new LottieRenderer({
    animationData,
    containerId,
    reverseY: true,
    speed,
    actions: {
      createPrecomp(id, { width, height }) {
        // nodes[id] = new cc.LayerColor(cc.color(30, 30, 0, 255), width, height)
        nodes[id] = new cc.Layer()
        nodes[id].setContentSize(width, height)
      },
      createImage(id, { path, name, width, height }) {
        // nodes[id] = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(name))
        nodes[id] = new cc.Sprite(useSpriteFrame ? name : path + name)
        nodes[id].setContentSize(width, height)
      },
      show(id) {
        nodes[id].setVisible(true)
      },
      hide(id) {
        nodes[id].setVisible(false)
      },
      delayShow(id, timeout) {
        addAction(id, cc.sequence([cc.delayTime(timeout), cc.show()]))
      },
      setPosition(id, { x, y }) {
        nodes[id].setPosition(x, y)
      },
      setPositionAnimation(id, data) {
        const sequenceActions = []
        data.forEach(item => {
          sequenceActions.push(
            cc.delayTime(item.delay),
            cc.moveTo(0, item.points[0]),
            cc.bezierTo(item.duration, item.points.slice(1)),
          )
        })
        addAction(id, cc.sequence(sequenceActions))
      },
      setRotation(id, { rotation }) {
        nodes[id].setRotation(rotation)
      },
      setRotationAnimatation(id, data) {
        const sequenceActions = []
        data.forEach(item => {
          sequenceActions.push(
            cc.delayTime(item.delay),
            cc.rotateTo(0, item.start[0]),
            cc.rotateTo(item.duration, item.end[0]),
          )
        })
        addAction(id, cc.sequence(sequenceActions))
      },
      setScale(id, { x, y }) {
        nodes[id].setScale(x / 100, y / 100)
      },
      setScaleAnimatation(id, data) {
        const sequenceActions = [cc.delayTime(0)]
        data.forEach(item => {
          sequenceActions.push(
            cc.delayTime(item.delay),
            cc.scaleTo(0, item.start[0] / 100, item.start[1] / 100),
            cc.scaleTo(item.duration, item.end[0] / 100, item.end[1] / 100),
          )
        })
        addAction(id, cc.sequence(sequenceActions))
      },
      setOpacity(id, { opacity }) {
        // nodes[id].setCascadeOpacityEnabled(true)
        nodes[id].setOpacity(opacity * 2.55)
      },
      setOpacityAnimation(id, data) {
        const sequenceActions = [cc.delayTime(0)]
        data.forEach(item => {
          sequenceActions.push(
            cc.delayTime(item.delay),
            cc.fadeTo(0, item.start[0] * 2.55),
            cc.fadeTo(item.duration, item.end[0] * 2.55),
          )
        })
        addAction(id, cc.sequence(sequenceActions))
      },
      setAnchor(id, { rx, ry }) {
        nodes[id].ignoreAnchorPointForPosition(false)
        nodes[id].setAnchorPoint(rx, ry)
      },
      appendChild(id, parentId) {
        nodes[parentId].addChild(nodes[id])
      },
      getNodeById(id) {
        return nodes[id]
      },
    },
  })

  renderer.generateAnimations()

  // console.log(actions)
  actions.forEach(({ id, action }) => {
    nodes[id].runAction(action)
  })
}
