import FlipflopCache from "../lib/flipflop-cache"
import { EntityModel } from "./models/entity"
import { Mongo } from "./mongo"
import { config } from "../config"
import { GeoUtils } from "../lib/geo-utils"
import { Const, EntityType } from "@maanex/spacelib-common"


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
  const CACHE_PRECISION = 200

  export function getCacheKey(x: number, y: number) {
    return `${~~(x/CACHE_PRECISION)}:${~~(y/CACHE_PRECISION)}}`
  }

  export function introduceEntity(e: EntityModel.DataType) {
    for (let x = -2; x <= 2; x++) {
      for (let y = -2; y <= 2; y++) {
        const pos = [ e.pos[0] + x*CACHE_PRECISION, e.pos[1] + y*CACHE_PRECISION ] as const
        if (!cache.has(getCacheKey(...pos))) continue
        cache.get(getCacheKey(...pos)).push(e)
      }
    }
  }

  export async function getEntitiesNear(x: number, y: number, range: number): Promise<EntityModel.DataType[]> {
    const realEnts = await makeEntitiesNearLookup(x, y)
    const naturalEnts = getNaturalEntitiesNearby(x, y, range)
    return [ ...realEnts, ...naturalEnts ].filter(e => GeoUtils.distancePoint(e.pos, x, y) <= range)
  }

  export async function makeEntitiesNearLookup(x: number, y: number): Promise<EntityModel.DataType[]> {
    const key = getCacheKey(x, y)
    if (cache.has(key))
      return cache.get(key)

    const entities: EntityModel.DataType[] = await Mongo.Entity.find({
      pos: {
        $geoWithin: {
          $center: [
            [ ~~(x/CACHE_PRECISION) * CACHE_PRECISION + CACHE_PRECISION/2,
              ~~(y/CACHE_PRECISION) * CACHE_PRECISION + CACHE_PRECISION/2 ],
            /* RANGE */ CACHE_PRECISION * 10
          ]
        }
      }
    }).lean(true).exec() as any

    console.log('DB CALL FOR NEW ENTITIES', { $center: [ [ ~~(x/CACHE_PRECISION) * CACHE_PRECISION + CACHE_PRECISION/2, ~~(y/CACHE_PRECISION) * CACHE_PRECISION + CACHE_PRECISION/2 ], /* RANGE */ CACHE_PRECISION * 10 ], yields: entities.length })

    cache.put(key, entities)
    return entities
  }

  //

  const naturalsChuckSize = 2000

  function naturalsSeededRandom(seed: number) {
    return 1 - Math.abs(Math.sin(seed * 19.41))
  }

  export function getNaturalEntitiesInChunk(chunkX: number, chunkY: number): EntityModel.DataType[] {
    const distFromCenter = Math.sqrt(((chunkX + .5) * naturalsChuckSize)**2 + ((chunkY + .5) * naturalsChuckSize)**2)
    const ring2Width = (Const.mapRing2 - Const.mapRing1)
    const density = 1 / (((distFromCenter - Const.mapRing1 - ring2Width/2) / (ring2Width/3))**8 + 1)

    if (density < 0.05) return []
    const ents = ~~(Math.random() * density * 10)
    const out: EntityModel.DataType[] = []

    const maxChunks = (Const.maxDistance / naturalsChuckSize) * 2

    for (let nr = 0; nr < ents; nr++) {
      const uuid = ~~((chunkX * maxChunks + chunkY) * 10 + nr)
      out.push({
        _id: uuid,
        creator: '',
        data: '',
        type: EntityType.RESOURCE,
        pos: [
          ~~((chunkX + naturalsSeededRandom(uuid + chunkY*0.821)) * naturalsChuckSize),
          ~~((chunkY + naturalsSeededRandom(uuid + chunkX*0.412)) * naturalsChuckSize)
        ]
      })
    }
    return out
  }

  export function getNaturalEntitiesNearby(x: number, y: number, range: number): EntityModel.DataType[] {
    const chunkXmin = ~~((x - range) / naturalsChuckSize)
    const chunkYmin = ~~((y - range) / naturalsChuckSize)
    const chunkXmax = ~~((x + range) / naturalsChuckSize)
    const chunkYmax = ~~((y + range) / naturalsChuckSize)

    const out = []
    for (let cx = chunkXmin; cx <= chunkXmax; cx++)
      for (let cy = chunkYmin; cy <= chunkYmax; cy++)
        out.push(...getNaturalEntitiesInChunk(cx, cy))
    return out
  }

}
