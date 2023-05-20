import FlipflopCache from "../lib/flipflop-cache"
import { EntityModel } from "./models/entity"
import { Mongo } from "./mongo"
import { config } from "../config"
import { GeoUtils } from "../lib/geo-utils"


export namespace EntityManager {

  let idCounter = 0
  export function createNewId() {
    return (~~(Date.now() / 1000)) * 1000 + ((idCounter++) % 1000)
  }

  //

  export async function createEntity(data: Omit<EntityModel.DataType, '_id'>): Promise<EntityModel.Type> {
    const ent: EntityModel.Type = new Mongo.Entity(data) as any
    await ent.save()
    introduceEntity(ent.toObject())
    return ent
  }

  const cache: FlipflopCache<EntityModel.DataType[]> = new FlipflopCache(config.caches.usersTtl)
  const CACHE_PRECISION = 100

  export function getCacheKey(x: number, y: number) {
    return `${~~(x/CACHE_PRECISION)}:${~~(y/CACHE_PRECISION)}}`
  }

  export function introduceEntity(e: EntityModel.DataType) {
    if (!cache.has(getCacheKey(...e.pos))) return
    cache.get(getCacheKey(...e.pos)).push(e)
  }

  export async function getEntitiesNear(x: number, y: number, range: number): Promise<EntityModel.DataType[]> {
    const ents = await makeEntitiesNearLookup(x, y)
    return ents.filter(e => GeoUtils.distancePoint(e.pos, x, y) <= range)
  }

  export async function makeEntitiesNearLookup(x: number, y: number): Promise<EntityModel.DataType[]> {
    const key = getCacheKey(x, y)
    if (cache.has(key))
      return cache.get(key)
    
    const entities: EntityModel.DataType[] = await Mongo.Entity.find({
      pos: {
        $geoWithin: {
          $center: [
            [ ~~(x/CACHE_PRECISION) + CACHE_PRECISION/2,
              ~~(y/CACHE_PRECISION) + CACHE_PRECISION/2 ],
            /* RANGE */ CACHE_PRECISION * 10
          ]
        }
      }
    }).lean(true).exec() as any

    console.log('DB CALL FOR NEW ENTITIES', { $center: [ [ ~~(x/CACHE_PRECISION) * CACHE_PRECISION + CACHE_PRECISION/2, ~~(y/CACHE_PRECISION) * CACHE_PRECISION + CACHE_PRECISION/2 ], /* RANGE */ CACHE_PRECISION * 10 ], yields: entities.length })

    cache.put(key, entities)
    return entities
  }

}
