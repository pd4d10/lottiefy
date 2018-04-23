function createNS(type) {
  const layer = new cc.LayerColor(cc.color(255, 255, 0, 0))
  layer.ignoreAnchorPointForPosition(false)
  layer.setAnchorPoint(0, 0)
  return layer
}

cc.Node.prototype.appendChild = cc.Node.prototype.addChild

cc.Node.prototype.insertBefore = cc.Node.prototype.addChild

function convertTransform(cssFormat) {
  const [a, b, c, d, tx, ty] = cssFormat
    .replace(/^matrix\((.*)\)$/, '$1')
    .split(',')
    .map(parseFloat)
  // console.log(a, b, c, d, tx, ty)
  return { a, b, c, d, tx, ty }
}

cc.Node.prototype.setAttribute = cc.Node.prototype.setAttributeNS = function(key, value) {
  // console.log(key, value)
  switch (key) {
    case 'width':
      // console.log(value, this)
      if (typeof value === 'number') {
        this.width = value
      } else if (value.slice(-2) === 'px') {
        this.width = parseFloat(value.slice(0, -2))
      }
      return
    case 'height':
      if (typeof value === 'number') {
        this.height = value
      }
      return
    case 'opacity':
      // this.setOpacity(value)
      return
    case 'transform':
      const [a, b, c, d, tx, ty] = value
        .replace(/^matrix\((.*)\)$/, '$1')
        .split(',')
        .map(parseFloat)

      this.setAdditionalTransform({ a, b, c, d, tx, ty: this.parent.height - ty })
      // console.log(value, this)
      return
  }
}

cc.Node.prototype.style = {
  set width(v) {
    // this.width = v
  },
  set height(v) {
    // this.height = v
  },
}

// Print node tree
window.ccTree = function ccTree(container) {
  function traverse(node, level = 0) {
    console.log(
      ' '.repeat(level),
      node.nm,
      node.getContentSize(),
      node.getPosition(),
      node._additionalTransform.tx,
      node._additionalTransform.ty,
      '\n',
      node,
    )

    for (let child of node.children) {
      traverse(child, level + 1)
    }
  }

  traverse(container)
}
