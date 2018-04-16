function CCBaseElement() {}

// extendPrototype([BaseElement], CCBaseElement)

CCBaseElement.prototype.initRendererElement = function() {}

CCBaseElement.prototype.createContainerElements = function() {
  this.container = new cc.LayerColor(cc.color(0, 0, 0, 0), this.data.w, this.data.h)
}

CCBaseElement.prototype.hide = function() {}

CCBaseElement.prototype.addMasks = function() {}

CCBaseElement.prototype.initExpressions = function() {
  // console.log(arguments)
}
