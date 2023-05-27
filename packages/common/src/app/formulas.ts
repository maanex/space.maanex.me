import { Const } from "./constants.js"


export namespace Formulas {

  export function simpleWriteCost(letterCount: number): number {
    return Math.ceil(((letterCount / 5) ** 3) / 6) + 20
  }

  export function radiationLevel(distance: number): number {
    return 1 / ((distance * 2 / Const.mapRing1)**6 + 1)
  }

}
