import {
  Actions,
  LayerType,
  Keyframe,
  BezierPoints,
  PositionAnimationData,
  SimpleKeyframe,
  SimpleAnimationData,
  BezierShape,
  ArrayPoint,
  AnimationData,
  Asset,
  Layer,
  ImageAsset,
  PrecompAsset,
  Id,
} from './types'
import { getId } from './utils'

export type Options = {
  /**
   * JSON data exported by Bodymovin
   */
  data: AnimationData
  /**
   * Id of container to render
   */
  containerId: string
  actions: Actions
  reverseY: boolean
  /**
   * Play speed
   */
  speed: number
  /**
   * Custom id generate function
   */
  generateId: (layer: Layer) => string

  layerFilter: (layer: Layer) => boolean
}

export default class LottieRenderer {
  private data: AnimationData
  private containerId: string // Container
  private actions: Actions
  private assets: { [id: string]: Asset }
  private layers: {
    // [id: string]: { data: Layer; width: number; height: number }
    [id: string]: any // TODO: Use correct type
  }
  private generateId: Options['generateId']
  private layerFilter: Options['layerFilter']
  speed: number

  /**
   * Some engine like Cocos2dx's Y coordinate
   */
  private reverseY: boolean

  constructor({
    data,
    containerId,
    actions,
    reverseY = false,
    generateId = getId,
    speed = 1,
    layerFilter = () => true,
  }: Options) {
    this.data = data
    this.assets = {}
    // Convert assets to a map for easily accessing
    for (let asset of data.assets) {
      this.assets[asset.id] = asset
    }

    this.layers = {}
    this.containerId = containerId
    this.actions = actions
    this.reverseY = reverseY
    this.generateId = generateId
    this.speed = speed
    this.layerFilter = layerFilter
  }

  private _getCorrectY(y: number, parentHeight: number) {
    return this.reverseY ? parentHeight - y : y
  }

  private _getTime(frame: number) {
    return frame / this.data.fr / this.speed
  }

  setSpeed(speed: number) {
    this.speed = speed
  }

  generateAnimations() {
    this.layers[this.containerId] = {
      // data: this.data,
      width: this.data.w,
      height: this.data.h,
    }
    this._traverseLayers(this.containerId, this.data.layers, 0, 0)
  }

  private _convertBezierShapeToPoints(
    bezierShape: BezierShape,
    parentHeight: number,
  ) {
    const result: BezierPoints[] = []
    for (let j = 0; j < bezierShape.v.length - 1; j++) {
      result.push(
        this._convertBezierArray(
          [
            bezierShape.v[j],
            bezierShape.o[j],
            bezierShape.i[j + 1],
            bezierShape.v[j + 1],
          ],
          parentHeight,
        ),
      )
    }
    return result
  }

  /**
   * Convert bezier points coordinate to absolute
   */
  private _convertBezierArray(
    points: [ArrayPoint, ArrayPoint, ArrayPoint, ArrayPoint],
    parentHeight: number,
  ): BezierPoints {
    return [
      {
        x: points[0][0],
        y: this._getCorrectY(points[0][1], parentHeight),
      },
      {
        x: points[0][0] + points[1][0],
        y: this._getCorrectY(points[0][1] + points[1][1], parentHeight),
      },
      {
        x: points[2][0] + points[3][0],
        y: this._getCorrectY(points[2][1] + points[3][1], parentHeight),
      },
      { x: points[3][0], y: this._getCorrectY(points[3][1], parentHeight) },
    ]
  }

  /**
   * Simple keyframe, like opacity, anchor and scale
   */
  private _parseSimpleKeyframe(
    keyframes: SimpleKeyframe[],
    startFrame: number,
  ): SimpleAnimationData[] {
    let data: SimpleAnimationData[] = []
    keyframes.slice(0, -1).forEach((keyframe, i) => {
      data.push({
        delay: i === 0 ? this._getTime(keyframe.t + startFrame) : 0,
        duration: this._getTime(keyframes[i + 1].t - keyframe.t),
        start: keyframe.s,
        end: keyframe.e,
      })
    })
    return data
  }

  /**
   * Position keyframe, calculated with Bezier curve
   * @param keyframes
   * @param parentHeight
   */
  private _parsePositionKeyframe(
    keyframes: Keyframe[],
    startFrame: number,
    parentHeight: number,
  ): PositionAnimationData[] {
    let data: PositionAnimationData[] = []
    keyframes.slice(0, -1).forEach((keyframe, i) => {
      data.push({
        delay: i === 0 ? this._getTime(keyframe.t + startFrame) : 0,
        duration: this._getTime(keyframes[i + 1].t - keyframe.t),
        points: this._convertBezierArray(
          [keyframe.s, keyframe.to, keyframe.ti, keyframe.e],
          parentHeight,
        ),
      })
    })
    return data
  }

  private _applyTransform(id: Id, parentId: Id, startFrame: number) {
    const { width, height, data: layer } = this.layers[id]
    const parentHeight = this.layers[parentId].height
    this.actions.delayShow(id, this._getTime(layer.st))

    // Opacity
    const oData = layer.ks.o.k
    // as SimpleKeyframe[]
    if (typeof oData === 'number') {
      this.actions.setOpacity(id, { opacity: oData })
    } else if (oData.length) {
      this.actions.setOpacity(id, { opacity: oData[0].s[0] })
      this.actions.setOpacityAnimation(
        id,
        this._parseSimpleKeyframe(oData, startFrame),
      )
    }

    // Anchor
    const aData = layer.ks.a.k
    const aY = this._getCorrectY(aData[1], height)
    this.actions.setAnchor(id, {
      x: aData[0],
      y: aY,
      rx: aData[0] / width,
      ry: aY / height,
    })

    // Position
    const pData = layer.ks.p.k
    if (typeof pData[0] === 'number') {
      this.actions.setPosition(id, {
        x: pData[0],
        y: this._getCorrectY(pData[1], parentHeight),
      })
    } else if (pData.length) {
      this.actions.setPosition(id, {
        x: pData[0].s[0],
        y: this._getCorrectY(pData[0].s[1], parentHeight),
      })
      this.actions.setPositionAnimation(
        id,
        this._parsePositionKeyframe(pData, startFrame, parentHeight),
      )
    }

    // Rotation
    const rData = layer.ks.r.k
    if (typeof rData === 'number') {
      this.actions.setRotation(id, { rotation: rData })
    } else if (typeof rData[0] === 'number') {
      this.actions.setRotation(id, { rotation: rData[0] })
    } else {
      this.actions.setRotation(id, { rotation: rData[0].s[0] })
      this.actions.setRotationAnimatation(
        id,
        this._parseSimpleKeyframe(rData, startFrame),
      )
    }

    // Scale
    const sData = layer.ks.s.k
    if (typeof sData[0] === 'number') {
      const [x, y] = sData
      this.actions.setScale(id, { x, y })
    } else {
      const [x, y] = sData[0].s
      this.actions.setScale(id, { x, y })
      this.actions.setScaleAnimatation(
        id,
        this._parseSimpleKeyframe(sData, startFrame),
      )
    }
  }

  getLayerWidthAndHeight = (lo: Layer) => {
    switch (lo.ty) {
      case LayerType.image:
        const asset = this.assets[lo.refId] as ImageAsset
        return [asset.w, asset.h]
      case LayerType.null:
        // FIXME: Assume null layer's width and height
        return (lo as any).ks.a.k.map((x: number) => x * 2)
      case LayerType.precomp:
        return [(lo as any).w, (lo as any).h]
      default:
    }
  }

  private _traverseLayer(currentId: Id, startFrame: number, parentId: Id) {
    const layerData = this.layers[currentId].data
    switch (layerData.ty) {
      // TODO: Add shape, solid and null handler
      case LayerType.shape:
      case LayerType.solid:
        break
      case LayerType.image: {
        const asset = this.assets[layerData.refId] as ImageAsset
        this.actions.createImage(currentId, {
          path: asset.u,
          name: asset.p,
          width: asset.w,
          height: asset.h,
        })
        this.actions.hide(currentId)
        this._applyTransform(currentId, parentId, startFrame)

        break
      }
      case LayerType.null:
      case LayerType.precomp: {
        const [width, height] = this.getLayerWidthAndHeight(layerData)
        this.actions.createPrecomp(currentId, { width, height })
        this.actions.hide(currentId)
        this._applyTransform(currentId, parentId, startFrame)

        const asset = this.assets[layerData.refId] as PrecompAsset
        if (asset && asset.layers) {
          this._traverseLayers(
            currentId,
            asset.layers,
            startFrame,
            layerData.st,
          )
        }

        break
      }
    }
  }

  private _traverseLayers(
    currentId: Id,
    layers: Layer[],
    startFrame: number,
    currentStartFrame: number,
  ) {
    const indexIdMapping: { [index: number]: Id } = {}
    const ids = []

    for (let i = layers.length; i > 0; i--) {
      const l = layers[i - 1]
      if (!this.layerFilter(l)) continue

      switch (l.ty) {
        case LayerType.image:
        case LayerType.precomp:
        case LayerType.null:
          const id = this.generateId(l)
          ids.push(id)
          const [width, height] = this.getLayerWidthAndHeight(l)
          this.layers[id] = { data: l, width, height }
          // console.log('layer', id)

          if (l.ind) {
            indexIdMapping[l.ind] = id
          }
      }
    }

    for (let id of ids) {
      const { parent } = this.layers[id].data
      const parentId = parent ? indexIdMapping[parent] : currentId
      this._traverseLayer(id, startFrame + currentStartFrame, parentId)
    }
    for (let id of ids) {
      const { parent } = this.layers[id].data
      const parentId = parent ? indexIdMapping[parent] : currentId
      this.actions.appendChild(id, parentId)
    }
  }
}
