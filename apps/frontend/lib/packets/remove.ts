import { EntityType } from "@maanex/spacelib-common"


export function REMOVE(_sock: ReturnType<typeof useSocket>, id: number) {
  const worldEntities = useWorldEntities().value
  const entity = worldEntities.get(id)
  if (!entity) return

  if (entity.type === EntityType.PERSON) {
    // real time update
    worldEntities.delete(id)
  } else {
    const pos = usePosition().value
    const dist = Math.sqrt((pos.x - entity.x)**2 + (pos.y - entity.y)**2)
    setTimeout(() => worldEntities.delete(id), dist * 10)
  }
}
