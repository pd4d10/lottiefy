function CCBaseElement() {}

CCBaseElement.prototype = {
  initRendererElement: function() {
    this.layerElement = createNS('g')
  },
  createContainerElements: function() {
    this.matteElement = createNS('g')
    this.transformedElement = this.layerElement
    this.maskedElement = this.layerElement
    this._sizeChanged = false
    var layerElementParent = null
    //If this layer acts as a mask for the following layer
    var filId, fil, gg
    if (this.data.td) {
      //
    } else if (this.data.tt) {
      //
    } else {
      this.baseElement = this.layerElement
    }
    if (this.data.ln) {
      this.layerElement.id = this.data.ln
    }
    if (this.data.cl) {
      this.layerElement.class = this.data.cl
    }
    if (this.data.nm) {
      this.layerElement.nm = this.data.nm
    }

    //Clipping compositions to hide content that exceeds boundaries. If collapsed transformations is on, component should not be clipped
    if (this.data.ty === 0 && !this.data.hd) {
      this.layerElement.width = this.data.w
      this.layerElement.height = this.data.h
    }
    if (this.data.bm !== 0) {
      this.setBlendMode()
    }
    this.renderableEffectsManager = new CCEffects(this)
  },
  renderElement: function() {
    const mProp = this.finalTransform.mProp
    if (this.finalTransform._matMdf) {
      this.transformedElement.setScale(mProp.s.v[0], mProp.s.v[1])

      if (mProp.r) {
        // TODO:
        this.transformedElement.setRotation(mProp.r.v)
      } else {
        console.log(mProp)
      }

      this.transformedElement.ignoreAnchorPointForPosition(false)
      this.transformedElement.setAnchorPoint(mProp.a.v[0] / this.data.w, 1 - mProp.a.v[1] / this.data.h)

      this.transformedElement.setPosition(mProp.p.v[0], this.transformedElement.parent.height - mProp.p.v[1])
    }
    if (this.finalTransform._opMdf) {
      this.transformedElement.setAttribute('opacity', mProp.o.v)
    }
  },
  destroyBaseElement: function() {
    this.layerElement = null
    this.matteElement = null
    this.maskManager.destroy()
  },
  getBaseElement: function() {
    if (this.data.hd) {
      return null
    }
    return this.baseElement
  },
  addMasks: function() {
    this.maskManager = new MaskElement(this.data, this, this.globalData)
  },
  setMatte: function(id) {
    if (!this.matteElement) {
      return
    }
    this.matteElement.setAttribute('mask', 'url(' + locationHref + '#' + id + ')')
  },
}
