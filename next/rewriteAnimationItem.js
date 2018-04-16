AnimationItem.prototype.setParams = function(params) {
  var self = this
  if (params.context) {
    this.context = params.context
  }
  if (params.wrapper || params.container) {
    this.wrapper = params.wrapper || params.container
  }
  var animType = params.animType ? params.animType : params.renderer ? params.renderer : 'svg'
  switch (animType) {
    // Add type cc here
    case 'cc':
      this.renderer = new CCRenderer(this, params.rendererSettings)
      break
    // End
    case 'canvas':
      this.renderer = new CanvasRenderer(this, params.rendererSettings)
      break
    case 'svg':
      this.renderer = new SVGRenderer(this, params.rendererSettings)
      break
    default:
      this.renderer = new HybridRenderer(this, params.rendererSettings)
      break
  }
  this.renderer.setProjectInterface(this.projectInterface)
  this.animType = animType

  if (params.loop === '' || params.loop === null) {
  } else if (params.loop === false) {
    this.loop = false
  } else if (params.loop === true) {
    this.loop = true
  } else {
    this.loop = parseInt(params.loop)
  }
  this.autoplay = 'autoplay' in params ? params.autoplay : true
  this.name = params.name ? params.name : ''
  this.autoloadSegments = params.hasOwnProperty('autoloadSegments') ? params.autoloadSegments : true
  this.assetsPath = params.assetsPath
  if (params.animationData) {
    self.configAnimation(params.animationData)
  } else if (params.path) {
    if (params.path.substr(-4) != 'json') {
      if (params.path.substr(-1, 1) != '/') {
        params.path += '/'
      }
      params.path += 'data.json'
    }

    var xhr = new XMLHttpRequest()
    if (params.path.lastIndexOf('\\') != -1) {
      this.path = params.path.substr(0, params.path.lastIndexOf('\\') + 1)
    } else {
      this.path = params.path.substr(0, params.path.lastIndexOf('/') + 1)
    }
    this.fileName = params.path.substr(params.path.lastIndexOf('/') + 1)
    this.fileName = this.fileName.substr(0, this.fileName.lastIndexOf('.json'))
    xhr.open('GET', params.path, true)
    xhr.send()
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          self.configAnimation(JSON.parse(xhr.responseText))
        } else {
          try {
            var response = JSON.parse(xhr.responseText)
            self.configAnimation(response)
          } catch (err) {}
        }
      }
    }
  }
}
