

export namespace World {

  const baseX = -175000
  const baseY = -355000
  const rad = 128 * 4

  export function newInitSpawnPos(): [ number, number ] {
    return [
      baseX + (Math.random() * rad * 2) - rad,
      baseY + (Math.random() * rad * 2) - rad
    ]
  }

}
