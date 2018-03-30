export interface Options {
  createLayer(id: string, width?: number, height?: number): any
  createSprite(id: string, name: string, width: number, height: number): any
  setPosition(id: string, x: number, y: number): any
  positionAnimate(id: string, data: any[], delay: number, parentHeight: number): any
  setAnchorPoint(id: string, x: number, y: number): any
  setRotation(id: string, rotation: number): any
  rotationAnimate(id: string, data: any[], delay: number): any
  setScale(id: string, x: number, y: number): any
  scaleAnimate(id: string, data: any[], delay: number): any
  moveTo(id: string, parentId: string, time: number, x: number, y: number): any
  setContentSize(id: string, width: number, height: number): any
  addChild(id: string, parentId: string, localZOrder?: number): any
  getNode(id: string): any
  setOpacity(id: string, opacity: number): void
  fadeTo(id: string, data: any[], delay: number): void

  createDrawNode(id: string, parentId: string, width: number): any
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