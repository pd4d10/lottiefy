function CCRenderer(animationItem, config) {
  this.globalData = {
    compSize: { w: 0, h: 0 },
  }

  this.elements = []
  this.pendingElements = []
}

extendPrototype([BaseRenderer], CCRenderer)

CCRenderer.prototype.configAnimation = function(animData) {
  this.data = animData
  this.globalData.compSize.w = animData.w
  this.globalData.compSize.h = animData.h
  this.layers = animData.layers
}

CCRenderer.prototype.buildItem = function(pos) {
  var elements = this.elements
  if (elements[pos] || this.layers[pos].ty == 99) {
    return
  }
  var element = this.createItem(this.layers[pos], this, this.globalData)
  elements[pos] = element
  element.initExpressions()
}

CCRenderer.prototype.checkPendingElements = function() {
  while (this.pendingElements.length) {
    var element = this.pendingElements.pop()
    element.checkParenting()
  }
}

CCRenderer.prototype.renderFrame = function(num) {
  // console.log(num)
}

CCRenderer.prototype.createImage = function(data) {
  return new CCImageElement(data, this.globalData, this)
}
CCRenderer.prototype.createComp = function(data) {
  return new CCCompElement(data, this.globalData, this)
}
CCRenderer.prototype.createSolid = function(data) {
  return new CCSolidElement(data, this.globalData, this)
}
CCRenderer.prototype.createNull = function(data) {
  return new NullElement(data, this.globalData, this)
}
