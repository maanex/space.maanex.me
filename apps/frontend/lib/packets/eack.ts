
export function EACK(sock: ReturnType<typeof useSocket>, trans: number, newId: number) {
  sock._int.eackCallbacks.get(trans)?.(newId)
  sock._int.eackCallbacks.delete(trans)
}
