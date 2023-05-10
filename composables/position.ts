

export type Position = {
  x: number
  y: number
}

export const usePosition = () => useState<Position>('shipPosition', () => ({
  x: 0,
  y: 0
}))
