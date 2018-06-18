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
  private layers: { [id: string]: { data: Layer } }
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
    for (let i = this.data.layers.length; i > 0; i--) {
      const layer = this.data.layers[i - 1]
      const id = this.generateId(layer)
      this.layers[id] = { data: layer }
      this._traverseLayer(id, layer, 0, this.data.w, this.data.h)
      this.actions.appendChild(id, this.containerId)
    }
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
   * @param keyframes
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

  private _applyTransform(
    layer: Layer,
    id: string,
    parentId: string,
    width: number,
    height: number,
    parentWidth: number,
    parentHeight: number,
    startFrame: number,
  ) {
    this.actions.delayShow(id, this._getTime(layer.st))

    // Opacity
    // if (layer.ks.o) {
    const { k } = layer.ks.o
    // as SimpleKeyframe[]
    if (typeof k === 'number') {
      this.actions.setOpacity(id, { opacity: k })
    } else if (k.length) {
      this.actions.setOpacity(id, { opacity: k[0].s[0] })
      this.actions.setOpacityAnimation(
        id,
        this._parseSimpleKeyframe(k, startFrame),
      )
    }
    // }

    // Anchor
    // if (layer.ks.a && layer.ks.a.k) {
    const [x, y] = layer.ks.a.k
    if (typeof x === 'number' && typeof y === 'number') {
      this.actions.setAnchor(id, {
        x: x / width,
        y: this._getCorrectY(y, height) / height,
        ax: x,
        ay: this._getCorrectY(y, height),
      })
    } else {
      console.log('Anchor error: ', id, layer.ks.a)
    }
    // }

    // Position
    if (layer.ks.p) {
      const { k } = layer.ks.p
      if (typeof k[0] === 'number') {
        this.actions.setPosition(id, {
          x: k[0],
          y: this._getCorrectY(k[1], parentHeight),
        })
      } else if (k.length) {
        this.actions.setPosition(id, {
          x: k[0].s[0],
          y: this._getCorrectY(k[0].s[1], parentHeight),
        })
        this.actions.setPositionAnimation(
          id,
          this._parsePositionKeyframe(k, startFrame, parentHeight),
        )
      }
    }

    // Rotation
    if (layer.ks.r && layer.ks.r.k) {
      const { k } = layer.ks.r
      if (typeof k === 'number') {
        this.actions.setRotation(id, { rotation: k })
      } else if (typeof k[0] === 'number') {
        this.actions.setRotation(id, { rotation: k[0] })
      } else {
        this.actions.setRotation(id, { rotation: k[0].s[0] })
        this.actions.setRotationAnimatation(
          id,
          this._parseSimpleKeyframe(k, startFrame),
        )
      }
    }

    // Scale
    if (layer.ks.s) {
      const { k } = layer.ks.s
      if (typeof k[0] === 'number') {
        const [x, y] = k
        this.actions.setScale(id, { x, y })
      } else {
        const [x, y] = k[0].s
        this.actions.setScale(id, { x, y })
        this.actions.setScaleAnimatation(
          id,
          this._parseSimpleKeyframe(k, startFrame),
        )
      }
    }
  }

  private _traverseLayer(
    currentId: Id,
    layerData: Layer,
    startFrame: number,
    parentWidth: number,
    parentHeight: number,
  ) {
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
        // this.actions.appendChild(id, parentId)
        this._applyTransform(
          layerData,
          currentId,
          '',
          asset.w,
          asset.h,
          parentWidth,
          parentHeight,
          startFrame,
        )

        break
      }
      case LayerType.null:
      case LayerType.precomp: {
        const getLayerWidthAndHeight = (l: any) => {
          if (l.ty === LayerType.null) {
            // FIXME: Assume null layer's width and height
            return l.ks.a.k.map((x: number) => x * 2)
          } else {
            if (!l.w) {
              console.warn('no width', l)
              return [0, 0]
            }
            return [l.w, l.h]
          }
        }
        const [width, height] = getLayerWidthAndHeight(layerData)
        this.actions.createPrecomp(currentId, { width, height })
        this.actions.hide(currentId)

        this._applyTransform(
          layerData,
          currentId,
          '',
          width,
          height,
          parentWidth,
          parentHeight,
          startFrame,
        )

        const asset = this.assets[layerData.refId] as PrecompAsset
        if (asset && asset.layers) {
          // TODO: Fix layer order
          const indexIdMapping: { [index: number]: Id } = {}
          const ids = []

          for (let i = asset.layers.length; i > 0; i--) {
            const l = asset.layers[i - 1]
            if (!this.layerFilter(l)) continue

            switch (l.ty) {
              case LayerType.image:
              case LayerType.precomp:
              case LayerType.null:
                const id = this.generateId(l)
                ids.push(id)
                this.layers[id] = { data: l }
                // console.log('layer', id)

                if (l.ind) {
                  indexIdMapping[l.ind] = id
                }
            }
          }

          for (let id of ids) {
            const { parent } = this.layers[id].data

            let parentId, parentWidth, parentHeight
            if (parent) {
              parentId = indexIdMapping[parent]
            } else {
              parentId = currentId
            }
            // console.log(parentId, this.layers)
            ;[parentWidth, parentHeight] = getLayerWidthAndHeight(
              this.layers[parentId].data,
            )

            this._traverseLayer(
              id,
              this.layers[id].data,
              startFrame + layerData.st,
              parentWidth,
              parentHeight,
            )
          }
          for (let id of ids) {
            const { parent } = this.layers[id].data
            let parentId, parentWidth, parentHeight
            if (parent) {
              parentId = indexIdMapping[parent]
            } else {
              parentId = currentId
            }
            this.actions.appendChild(id, parentId)
          }
        }

        break
      }
    }
  }
}
