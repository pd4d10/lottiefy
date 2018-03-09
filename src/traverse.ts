import {
  Animation,
  Assets,
  Height1,
  Width2,
  Id,
  ImageName,
  ImagePath,
  Id1,
  Layers1,
} from '../typings/animation'

interface Options {
  createLayer(id: string): any
  createSprite(id: string, name: string): any
  setPosition(id: string, parentId: string, x: number, y: number): any
  setAnchorPoint(id: string, x: number, y: number): any
  moveTo(id: string, parentId: string, time: number, x: number, y: number): any
  setContentSize(id: string, width: number, height: number): any
  addChild(id: string, parentId: string): any
}

type Asset =
  | {
      h?: Height1
      w?: Width2
      id?: Id
      p?: ImageName
      u?: ImagePath
      [k: string]: any
    }
  | {
      id?: Id1
      layers?: Layers1
      [k: string]: any
    }

export function traverse(data: any, containerId: string, options: Options) {
  let assets: {
    [id: string]: Asset
  }

  function getAsset(id: string) {
    if (!assets) {
      assets = {}
      for (let asset of data.assets as Assets) {
        if (asset.id) {
          assets[asset.id] = asset
        }
      }
    }
    return assets[id]
  }

  function _traverse(item: Animation, parentId: string, options: Options) {
    if (!item.layers) {
      return
    }
    const itemId = item.id

    for (let layer of item.layers) {
      console.log(`-- ${layer.nm}, ${layer.refId}`)

      const id = layer.refId
      const asset = getAsset(id)

      if (asset) {
        if (asset.layers) {
          options.createLayer(id)
        }
        if (asset.p) {
          options.createSprite(id, asset.p)
        }

        // size
        options.setContentSize(id, layer.w || asset.w, layer.h || asset.h)

        if (layer.ks) {
          if (layer.ks.s && layer.ks.s.k) {
            const [x, y] = layer.ks.s.k
            if (typeof x === 'number' && typeof y === 'number') {
            }
          }

          if (layer.ks.o) {
          }

          // anchor
          if (layer.ks.a && layer.ks.a.k) {
            const [x, y] = layer.ks.a.k
            if (typeof x === 'number' && typeof y === 'number') {
              let { w = 10000, h = 10000 } = layer // FIXME:
              options.setAnchorPoint(id, x / w, 1 - y / h)
            }
          }

          // position
          if (layer.ks.p) {
            if (layer.ks.p.k) {
              if (typeof layer.ks.p.k[0] === 'number') {
                var [x, y] = layer.ks.p.k
                options.setPosition(id, parentId, x, y)
              } else if (layer.ks.p.k.length) {
                const [{ s, e }, { t }] = layer.ks.p.k
                options.setPosition(id, parentId, s[0], s[1])
                options.moveTo(id, parentId, t / 40, e[0], e[1])
              }
            }
          }
        }

        if (asset.layers) {
          _traverse(asset, id, options)
        }

        options.addChild(id, parentId)
      }
    }
  }

  _traverse(data, containerId, options)
}
