function createNS(type) {
  return new cc.LayerColor(cc.color(255, 255, 0, 30), 0, 0)
}

cc.Node.prototype.appendChild = cc.Node.prototype.addChild

cc.Node.prototype.insertBefore = cc.Node.prototype.addChild

function convertTransform(cssFormat) {
  const [a, b, c, d, tx, ty] = cssFormat.replace(/^matrix\((.*)\)$/, '$1').split(',')
  console.log(a, b, c, d, tx, ty)
  return { a, b, c, d, tx, ty }
}

cc.Node.prototype.setAttribute = cc.Node.prototype.setAttributeNS = function(key, value) {
  // console.log(key, value, this)
  switch (key) {
    case 'width':
      this.width = value
      return
    case 'height':
      this.height = value
      return
    case 'opacity':
      this.setOpacity(value)
      return
    case 'transform':
      this.setAdditionalTransform(convertTransform(value))
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
