function CCGradientStrokeStyleData(elem, data, styleOb){
	this.w = PropertyFactory.getProp(elem,data.w,0,null,elem);
	this.d = new DashProperty(elem,data.d||{},'svg',elem);
    this.initGradientData(elem, data, styleOb);
}

CCGradientStrokeStyleData.prototype.initGradientData = CCGradientFillStyleData.prototype.initGradientData;
CCGradientStrokeStyleData.prototype.setGradientData = CCGradientFillStyleData.prototype.setGradientData;
CCGradientStrokeStyleData.prototype.setGradientOpacity = CCGradientFillStyleData.prototype.setGradientOpacity;