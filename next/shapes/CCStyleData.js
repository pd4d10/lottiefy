function CCStyleData(data, level) {
	this.data = data;
	this.type = data.ty;
	this.d = '';
	this.lvl = level;
	this._mdf = false;
	this.closed = false;
	this.pElem = createNS('path');
	this.msElem = null;
}

CCStyleData.prototype.reset = function() {
	this.d = '';
	this._mdf = false;
};