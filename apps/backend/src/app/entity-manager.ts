import FlipflopCache from "../lib/flipflop-cache.js"
import { EntityModel } from "../database/models/entity.js"
import { Mongo } from "../database/mongo.js"
import { config } from "../config.js"
import { GeoUtils } from "../lib/geo-utils.js"
import { Const, EntityType } from "@maanex/spacelib-common"
import { World } from "./world.js"


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
    return [ ...realEnts, ...naturalEnts ].filter(e => GeoUtils.distancePoint(e.pos, x, y) <= (e.type === EntityType.SPECIAL ? 3*range : range))
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

  const naturalsChuckSize = 3000
  export const naturalsRichness: FlipflopCache<number> = new FlipflopCache(config.caches.naturalEntitiesTtl)

  function naturalsSeededRandom(seed: number) {
    return 1 - Math.abs(Math.sin(seed * 19.41))
  }

  export function getNaturalEntitiesInChunk(chunkX: number, chunkY: number): EntityModel.DataType[] {
    const distFromCenter = Math.sqrt(((chunkX + .5) * naturalsChuckSize)**2 + ((chunkY + .5) * naturalsChuckSize)**2)
    const ring2Width = (Const.mapRing2 - Const.mapRing1)
    const density = 1 / (((distFromCenter - Const.mapRing1 - ring2Width/2) / (ring2Width/3))**8 + 1)

    if (density < 0.05) return []
    const ents = ~~((1 - naturalsSeededRandom(chunkX*1.14 + chunkY*0.914 + 4)) * density * 10)
    const out: EntityModel.DataType[] = []

    const maxChunks = (Const.maxDistance / naturalsChuckSize) * 2

    for (let nr = 0; nr < ents; nr++) {
      const uuid = ~~((chunkX * maxChunks + chunkY) * 10 + nr)
      const seenBefore = naturalsRichness.has(String(uuid))
      const richness = seenBefore
        ? naturalsRichness.get(String(uuid))
        : ~~(Math.random() * 100 + 20)
      if (!seenBefore) naturalsRichness.put(String(uuid), richness)
      if (richness === 0) continue

      out.push({
        _id: uuid,
        creator: '',
        data: richness,
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

    const out: EntityModel.DataType[] = [ ...World.worldsEntities ]
    for (let cx = chunkXmin; cx <= chunkXmax; cx++)
      for (let cy = chunkYmin; cy <= chunkYmax; cy++)
        out.push(...getNaturalEntitiesInChunk(cx, cy))
    return out
  }

}
