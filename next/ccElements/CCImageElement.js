function CCImageElement(data,globalData,comp){
  this.assetData = globalData.getAssetData(data.refId);
  this.initElement(data,globalData,comp);
}

extendPrototype([BaseElement,TransformElement,SVGBaseElement,HierarchyElement,FrameElement,RenderableDOMElement], CCImageElement);

CCImageElement.prototype.createContent = function(){

  var assetPath = this.globalData.getAssetsPath(this.assetData);

  this.innerElem = new cc.Sprite(this.assetData.u + this.assetData.p)
  this.innerElem.setContentSize(this.assetData.w, this.assetData.h)
  // this.innerElem.setAttribute('preserveAspectRatio','xMidYMid slice');
  // this.innerElem.setAttributeNS('http://www.w3.org/1999/xlink','href',assetPath);

  this.layerElement.appendChild(this.innerElem);
};
