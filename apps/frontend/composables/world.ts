import { EntityType } from "~/../../packages/common/dist"


export type Entity = {
  id: number
  x: number
  y: number
  type: EntityType
  data: string
}

export const useWorldEntities = () => useState<Map<number, Entity>>('world', () => new Map())
