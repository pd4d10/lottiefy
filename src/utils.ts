import { Layer } from './types'

const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

export function getId(layer: Layer) {
  let id = ''
  for (let i = 0; i < 8; i++) {
    id += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return (layer.refId || 'unknown') + '_' + (layer.nm || 'unknown') + '_' + id
}
