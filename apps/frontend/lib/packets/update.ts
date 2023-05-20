

export function UPDATE(_sock: ReturnType<typeof useSocket>, id: number, type: number, x: number, y: number, data: any) {
  const worldEntities = useWorldEntities().value
  const existing = worldEntities.get(id)
  if (existing) {
    existing.type = type
    existing.x = x
    existing.y = y
    existing.data = data
  } else {
    worldEntities.set(id, { id, type, x, y, data })
  }
}
