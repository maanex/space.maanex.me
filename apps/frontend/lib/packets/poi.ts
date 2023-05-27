

export function POI(_sock: ReturnType<typeof useSocket>, x: number, y: number, type: number, name: string) {
  const pos = usePosition().value
  const dist = Math.sqrt((pos.x - x)**2 + (pos.y - y)**2)
  setTimeout(() => doUpdate(x, y, type, name), Math.sqrt(dist) * 5)
}

function doUpdate(x: number, y: number, type: number, name: string) {
  const worldPois = useWorldPois().value
  const existing = worldPois.get(name)
  if (existing) {
    existing[0] = x
    existing[1] = y
    existing[2] = type
    existing[3] = name
  } else {
    worldPois.set(name, [ x, y, type, name ])
  }
}
