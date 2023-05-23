
export function POS(_sock: ReturnType<typeof useSocket>, x: number, y: number, rot: number) {
  usePosition().value.x = x
  usePosition().value.y = y

  if (rot !== null)
    useDirectionHandle().value = rot
}
