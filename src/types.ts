export interface Options {
  createShape(
    id: string,
    parentId: string,
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number
  ): any
  createLayer(id: string, width?: number, height?: number): any
  createSprite(id: string, name: string): any
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
  getNode(id: string): cc.Node

  createDrawNode(id: string, parentId: string): any
  drawCubicBezier(
    id: string,
    origin: cc.Point,
    c1: cc.Point,
    c2: cc.Point,
    dest: cc.Point,
    width: number,
    color: Color
  ): any
}

export type Color = {
  r: number
  g: number
  b: number
  a: number
}
