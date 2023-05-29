
export type ArrowStr = 'up' | 'down' | 'left' | 'right'


export function renderTextBlock(text: string, lineStart: string, lineEnd: string, width: number, height: number): string[] {
  const innerWidth = width - lineStart.length - lineEnd.length
  let remaining = text.split(' ')

  let out: string[] = []
  nextLine:
  for (let i = 0; i < height; i++) {
    out.push('')
    while (remaining.length) {
      const word = remaining[0]
      if ((out[i].length + word.length + 1) > innerWidth) continue nextLine
      out[i] += ' ' + word
      remaining.shift()
    }
  }

  return out.map(o => `${lineStart}${o.slice(1).padEnd(innerWidth)}${lineEnd}`)
}
