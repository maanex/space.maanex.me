import { EntityType, WorldsEntities } from "@maanex/spacelib-common"


export function UPDATE(_sock: ReturnType<typeof useSocket>, id: number, type: number, x: number, y: number, data: any) {
  if (type === EntityType.PERSON) {
    // real time update
    doUpdate(id, type, x, y, data)
  } else {
    const pos = usePosition().value
    const dist = Math.sqrt((pos.x - x)**2 + (pos.y - y)**2)
    setTimeout(() => doUpdate(id, type, x, y, data), dist * 2)
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

  const docs = useDocuments()
  if (id === WorldsEntities.MERCHANT_WESTSIDE_OUTPOST && !docs.value.has('worldent_westside_outpost'))
    docs.value.set('worldent_westside_outpost', false)
  else if (id === WorldsEntities.MERCHANT_EASTSIDE_OUTPOST && !docs.value.has('worldent_eastside_outpost'))
    docs.value.set('worldent_eastside_outpost', false)
  else if (id === WorldsEntities.MERCHANT_CENTRAL_MARKET && !docs.value.has('worldent_central_market'))
    docs.value.set('worldent_central_market', false)
  else if (id === WorldsEntities.MERCHANT_BELOR_TOOLS && !docs.value.has('worldent_belor_tools'))
    docs.value.set('worldent_belor_tools', false)
  else if (id === WorldsEntities.MERCHANT_THIRD_SECTOR && !docs.value.has('worldent_third_sector'))
    docs.value.set('worldent_third_sector', false)
  else if (id === WorldsEntities.MERCHANT_BOUJIN && !docs.value.has('worldent_boujin'))
    docs.value.set('worldent_boujin', false)
}
