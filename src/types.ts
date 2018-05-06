export interface Actions {
  /**
   * Generate a random element id. If not specified, uuid will be used.
   */
  generateId?(): string

  /**
   * Create a precomp
   * @param id Element id
   * @param width Precomp width
   * @param height Precomp height
   */
  createPrecomp(id: string, width: number, height: number): void

  /**
   * Create an image
   * @param id Element id
   * @param path Image path
   * @param name Image name
   * @param width Image width
   * @param height Image height
   */
  createImage(
    id: string,
    path: string,
    name: string,
    width: number,
    height: number,
  ): void

  /**
   * Set position of an element
   * @param id Element id
   * @param x X axis position
   * @param y Y axis position
   */
  setPosition(id: string, x: number, y: number): void

  /**
   * Set an animation of position
   * @param id
   * @param data
   * @param delay
   * @param parentHeight
   */
  setPositionAnimation(
    id: string,
    data: any[],
    delay: number,
    parentHeight: number,
  ): any

  /**
   * Set anchor point of an element
   * @param id
   * @param x
   * @param y
   */
  setAnchor(id: string, x: number, y: number): any

  /**
   * Set rotation angle of an element
   * @param id
   * @param rotation
   */
  setRotation(id: string, rotation: number): any

  /**
   *
   * @param id
   * @param data
   * @param delay
   */
  setRotationAnimatation(id: string, data: any[], delay: number): any

  /**
   *
   * @param id Element Id
   * @param x X axis scale value
   * @param y Y axis scale value
   */
  setScale(id: string, x: number, y: number): any

  /**
   *
   * @param id
   * @param data
   * @param delay
   */
  setScaleAnimatation(id: string, data: any[], delay: number): any

  /**
   * Set content size of an element
   * @param id
   * @param width
   * @param height
   */
  setContentSize(id: string, width: number, height: number): any

  /**
   * Append an element as a child
   * @param id
   * @param parentId
   * @param localZOrder
   */
  appendChild(id: string, parentId: string, localZOrder?: number): any

  /**
   * Get instance by Id
   */
  getNodeById(id: string): any

  /**
   *
   * @param id Element id
   * @param opacity 0-255
   */
  setOpacity(id: string, opacity: number): void

  /**
   * Set (AKA fade)
   * @param id
   * @param data
   * @param delay
   */
  setOpacityAnimation(id: string, data: any[], delay: number): void

  createShape(id: string, parentId: string, width: number): any

  drawCubicBezier(
    id: string,
    origin: cc.Point,
    c1: cc.Point,
    c2: cc.Point,
    dest: cc.Point,
    width: number,
    color: Color,
  ): any
  drawEllipse(id: string, ...args: any[]): void
  curveAnimate(id: string, width: number, color: Color, config: any): any
}

export type Color = [number, number, number, number]

export enum Layer {
  precomp = 0,
  solid = 1,
  image = 2,
  null = 3,
  shape = 4,
  text = 5,
}

export enum Shape {
  ellipse = 'el',
  group = 'gr',
  shape = 'sh',
  transform = 'tr',
  stroke = 'st',
  fill = 'fl',
  merge = 'mm',
}

export enum Effect {
  slider = 0,
  angle = 1,
  color = 2,
  point = 3,
  checkbox = 4,
  group = 5,
  dropDown = 7,
}

export type Keyframe = {
  t: number
  s: any
  e: any
  to: any
  ti: any
}
