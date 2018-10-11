const { LottieRenderer, getId } = require('lottiefy')

function getPoint({ x, y }) {
  return `cc.p(${x},${y})`
}

module.exports = function generate({
  animationData,
  containerId,
  layerFilter,
}) {
  let code = `local t = {}`
  const append = str => {
    code += str + '\n'
  }
  const convertPoint = points => {
    return points.map(p => `cc.p(${p.x}, ${p.y})`).join(',')
  }
  const convertColor = ([r, g, b, a]) => {
    return `cc.c4f(${r}, ${g}, ${b}, ${a})`
  }
  const renderer = new LottieRenderer({
    animationData,
    reverseY: true,
    generateId: layer => (layer.nm || 'v') + '_' + getId(), // for lua variables
    containerId,
    layerFilter,
    actions: {
      createPrecomp(id, { width, height }) {
        append(`t['${id}'] = cc.Layer:create()`)
        append(`t['${id}']:setContentSize(${width}, ${height})`)
      },
      createImage(id, { path, name, width, height }) {
        append(`t['${id}'] = display.newSprite("#${name}")`)
        append(`t['${id}']:setContentSize(${width}, ${height})`)
      },
      show(id) {
        append(`t['${id}']:setVisible(true)`)
      },
      hide(id) {
        append(`t['${id}']:setVisible(false)`)
      },
      delayShow(id, start, end) {
        const sequenceActions = [
          `cc.DelayTime:create(${start})`,
          `cc.Show:create()`,
          `cc.DelayTime:create(${end - start})`,
          `cc.Hide:create()`,
        ]
        append(
          `table.insert(data, {node=t['${id}'],action=cc.Sequence:create({
            ${sequenceActions.join(',')}
          })})`,
        )
      },
      setPosition(id, { x, y }) {
        append(`t['${id}']:setPosition(cc.p(${x}, ${y}))`)
      },
      setPositionAnimation(id, data) {
        const sequenceActions = []
        data.forEach(({ delay, duration, points }) => {
          sequenceActions.push(
            `cc.DelayTime:create(${delay})`,
            `cc.MoveTo:create(0, ${getPoint(points[0])})`,
            `cc.BezierTo:create(${duration}, { ${getPoint(
              points[1],
            )}, ${getPoint(points[2])}, ${getPoint(points[3])} })`,
          )
        })
        append(
          `table.insert(data, {node=t['${id}'],action=cc.Sequence:create({
            ${sequenceActions.join(',')}
          })})`,
        )
      },
      setRotation(id, { rotation }) {
        append(`t['${id}']:setRotation(${rotation})`)
      },
      setRotationAnimatation(id, data) {
        let sequenceActions = []
        data.forEach(item => {
          sequenceActions.push(
            `cc.DelayTime:create(${item.delay})`,
            `cc.RotateTo:create(0, ${item.start[0]})`,
            `cc.RotateTo:create(${item.duration}, ${item.end[0]})`,
          )
        })
        append(
          `table.insert(data, {node=t['${id}'],action=cc.Sequence:create({
            ${sequenceActions.join(',')}
          })})`,
        )
      },
      setScale(id, { x, y }) {
        append(`t['${id}']:setScaleX(${x / 100})`)
        append(`t['${id}']:setScaleY(${y / 100})`)
      },
      setScaleAnimatation(id, data, delay) {
        const sequenceActions = []
        data.forEach(item => {
          sequenceActions.push(
            `cc.DelayTime:create(${item.delay})`,
            `cc.ScaleTo:create(0, ${item.start[0] / 100}, ${item.start[1] /
              100})`,
            `cc.ScaleTo:create(${item.duration}, ${item.end[0] / 100}, ${item
              .end[1] / 100})`,
          )
        })
        append(
          `table.insert(data, {node=t['${id}'],action=cc.Sequence:create({
            ${sequenceActions.join(',')}
          })})`,
        )
      },
      setAnchor(id, { rx, ry }) {
        // if (isNaN(rx)) return
        append(`t['${id}']:ignoreAnchorPointForPosition(false)
      t['${id}']:setAnchorPoint(cc.p(${rx}, ${ry}))`)
      },
      appendChild(id, parentId) {
        const c = parentId === 'g' ? 'g' : `t['${parentId}']`
        append(`${c}:addChild(t['${id}'])`)
      },
      setOpacity(id, { opacity }) {
        append(`t['${id}']:setOpacity(${opacity * 2.55})`)
      },
      setOpacityAnimation(id, data) {
        const sequenceActions = []
        data.forEach(item => {
          sequenceActions.push(
            `cc.DelayTime:create(${item.delay})`,
            `cc.FadeTo:create(0, ${item.start[0] * 2.55})`,
            `cc.FadeTo:create(${item.duration}, ${item.end[0] * 2.55})`,
          )
        })
        append(
          `table.insert(data, {node=t['${id}'],action=cc.Sequence:create({
              ${sequenceActions.join(',')}
          })})`,
        )
      },
    },
  })
  renderer.generateAnimations()
  return code
}
