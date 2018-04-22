function createNS(type) {
  return new cc.LayerColor(cc.color(255, 255, 0, 30), 0, 0)
}

cc.Node.prototype.appendChild = cc.Node.prototype.addChild

cc.Node.prototype.insertBefore = cc.Node.prototype.addChild

cc.Node.prototype.setAttribute = cc.Node.prototype.setAttributeNS = function(key, value) {
  switch (key) {
    case 'width':
      this.width = value
      return
    case 'height':
      this.height = value
      return
    case 'transform':
      console.log(key, value, this)
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
