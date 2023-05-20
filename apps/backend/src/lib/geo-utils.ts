

export namespace GeoUtils {

  export function distance(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt((x1 - x2)**2 + (y1 - y2)**2)
  }

  export function distancePoint(point: [ number, number ], x: number, y: number) {
    return Math.sqrt((point[0] - x)**2 + (point[1] - y)**2)
  }

}
