export function degToRad(deg) {
  return (deg * Math.PI) / 180
}

function _bezier(k, points, t) {
  return (
    Math.pow(1 - t, 3) * points[0][k] +
    Math.pow(1 - t, 2) * t * points[1][k] +
    (1 - t) * Math.pow(t, 2) * points[2][k] +
    Math.pow(t, 3) * points[3][k]
  )
}

export function bezier(points, t) {
  return {
    x: _bezier('x', points, t),
    y: _bezier('y', points, t),
  }
}

export function linear(start, end, t) {
  return (1 - t) * start + t * end
}
