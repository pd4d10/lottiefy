export interface Options {
  createLayer(id: string, width?: number, height?: number): any
  createSprite(id: string, name: string): any
  setPosition(id: string, x: number, y: number): any
  positionAnimate(
    id: string,
    data: any[],
    delay: number,
    parentHeight: number,
  ): any
  setAnchorPoint(id: string, x: number, y: number): any
  setRotation(id: string, rotation: number): any
  rotationAnimate(id: string, data: any[], delay: number): any
  setScale(id: string, x: number, y: number): any
  scaleAnimate(id: string, data: any[], delay: number): any
  moveTo(id: string, parentId: string, time: number, x: number, y: number): any
  setContentSize(id: string, width: number, height: number): any
  addChild(id: string, parentId: string, localZOrder?: number): any
  getNode(id: string): any

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
}

export type Color = {
  r: number
  g: number
  b: number
  a: number
}

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
