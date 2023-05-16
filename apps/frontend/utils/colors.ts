

export function HSLToRGB(h: number, s: number, l: number): number {
  const k = (n: number) => (n + h / 30) % 12
  const f = (n: number) => (l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))) * 0xFF

  return (f(0) << 16) | (f(8) << 8) | f(4)
}

