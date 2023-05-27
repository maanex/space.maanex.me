

export function JOURNAL(_sock: ReturnType<typeof useSocket>, name: string) {
  const docs = useDocuments()
  if (docs.value.has(name)) return
  docs.value.set(name, false)
}
