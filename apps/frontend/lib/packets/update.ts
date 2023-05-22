import { EntityType } from "@maanex/spacelib-common"


export function UPDATE(_sock: ReturnType<typeof useSocket>, id: number, type: number, x: number, y: number, data: any) {
  if (type === EntityType.PERSON) {
    // real time update
    doUpdate(id, type, x, y, data)
  } else {
    const pos = usePosition().value
    const dist = Math.sqrt((pos.x - x)**2 + (pos.y - y)**2)
    setTimeout(() => doUpdate(id, type, x, y, data), dist * 10)
  }
}

function doUpdate(id: number, type: number, x: number, y: number, data: any) {
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
