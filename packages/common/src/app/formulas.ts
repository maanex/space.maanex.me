

export namespace Formulas {

  export function simpleWriteCost(letterCount: number): number {
    return Math.ceil(((letterCount / 5) ** 3) / 6) + 20
  }

}
