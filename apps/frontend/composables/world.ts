

export enum EntityType {
  UNKNOWN = 0,
  PERSON = 1,
  MESSAGE = 2,
}

export type Entity = {
  id: number
  x: number
  y: number
  type: EntityType
  data: string
}

export const useWorldEntities = () => useState<Entity[]>('world', () => [
  {
    id: 51212421,
    x: 50,
    y: 50,
    type: EntityType.MESSAGE,
    data: 'This is my message right here right now. I cant anymore this is absurdly absurd'
  }
])
