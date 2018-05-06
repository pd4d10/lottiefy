type Keyframe = {
  t: number
  s: any
  e: any
  to: any
  ti: any
}

// function getTimeSecond(frame: number, )

export function parseKeyframe(keyframes: Keyframe[], framePerSecond: number) {
  let nextTime = null
  let result = []

  for (let i = keyframes.length - 1; i >= 0; i--) {
    const { s, e, to, ti, t } = keyframes[i]
    if (s) {
      result.unshift({
        s,
        e,
        to,
        ti,
        t: (nextTime - t) / framePerSecond,
        startTime: i === 0 ? t / framePerSecond : 0,
      })
    }
    nextTime = t
  }
  // console.log(result)

  return result
}
