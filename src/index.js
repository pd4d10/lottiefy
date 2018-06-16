import LottieRenderer from 'lottie-renderer'

const nodes = {}
const actions = []

function addAction(id, action) {
  actions.push({ id, action })
}

export default function loadAnimation(data, g) {
  // const container = new cc.LayerColor(cc.color(40, 40, 0, 100), data.w, data.h)
  const container = new cc.Layer()
  container.setContentSize(data.w, data.h)
  container.setScale(0.5)
  const containerId = 'xxxxx'
  nodes[containerId] = container
  g.addChild(container)
  window.c = container
  var useSpriteFrame = false

  const renderer = new LottieRenderer({
    data,
    containerId,
    reverseY: true,
    actions: {
      createPrecomp(id, { width, height }) {
        nodes[id] = new cc.LayerColor(cc.color(0, 30, 30, 255), width, height)
        // nodes[id] = new cc.Layer()
        nodes[id].setContentSize(width, height)
      },
      createImage(id, { path, name, width, height }) {
        // nodes[id] = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(name))
        nodes[id] = new cc.Sprite(useSpriteFrame ? name : path + name)
        nodes[id].setContentSize(width, height)
      },
      setPosition(id, { x, y }) {
        nodes[id].setPosition(x, y)
      },
      setPositionAnimation(id, data) {
        const sequenceActions = [cc.delayTime(0)]
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
        const sequenceActions = [cc.delayTime(0)]
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
      setContentSize(id, { width, height }) {
        nodes[id].setContentSize(width, height)
      },
      setAnchor(id, { x, y }) {
        nodes[id].ignoreAnchorPointForPosition(false)
        nodes[id].setAnchorPoint(x, y)
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
