import { EntityType, Packet } from "~/../../packages/common/dist"


export type Entity = {
  id: number
  x: number
  y: number
  type: EntityType
  data: string
}

export const useWorldEntities = () => useState<Map<number, Entity>>('world', () => new Map())

export const useWorldPois = () => useState<Map<string, Packet.SC.Poi>>('pois', () => new Map())

export const useRadiation = () => useState<number>('radiation', () => 0)

export const useScanEffects = () => useState<[number, number][]>('scaneffects', () => [])
