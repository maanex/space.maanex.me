import { UserUnlocks } from "./enums.js"


export function userMeetsRequirements(requirements: UserUnlocks[][], userHas: UserUnlocks[]): boolean {
  if (!requirements.length) return true

  nextOr:
  for (const orGroup of requirements) {
    for (const andGroup of orGroup) {
      if (!userHas.includes(andGroup))
        continue nextOr
    }
    return true
  }
  return false
}
