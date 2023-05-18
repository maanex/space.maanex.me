

export type Vector = {
  x: number
  y: number
}

export const usePosition = () => useState<Vector>('shipPosition', () => ({
  x: 0,
  y: 0
}))

export const useAcceleration = () => useState<Vector>('shipAcceleration', () => ({
  x: 0,
  y: 0
}))

export const useCrosshairs = () => useState<Record<string, Vector>>('uiCrosshairs', () => ({}))
