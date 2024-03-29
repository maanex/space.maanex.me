/* eslint-disable spaced-comment */
import { Schema as MongooseSchema, Document as MongooseDocument } from 'mongoose'
import { UnifiedUserObject } from '../../lib/oauth-strat.js'
import { randomBytes } from 'node:crypto'
import { Const, UserUnlocks } from '@maanex/spacelib-common'
import { World } from '../../app/world.js'


export namespace UserModel {

  // ===== ARRAY CONSTANTS ===== //

  // export const AnnouncementApprovalStatus = [ 'pending', 'declined', 'published' ] as const
  // export const AnnouncementApprovalStatusArray = AnnouncementApprovalStatus as readonly string[]
  // export type AnnouncementApprovalStatusType = typeof AnnouncementApprovalStatus[number]


  // ===== HELPER TYPES ===== //


  // ===== EXPORT TYPES ===== //

  /** A reduced type to use internally */
  export type DataType = {
    _id: string
    uuid: string
    authn: UnifiedUserObject
    tos: boolean
    posX: number
    posY: number
    resources: number
    unlocks: UserUnlocks[]
  }

  /** The user mongoose object, muteable and saveable */
  export type Type = DataType & Omit<MongooseDocument<any, {}>, '_id'>

  /** The sanitized version of the data, gets served out by the api */
  export type SanitizedType = {
    id: string
    uuid: string
    tos: boolean
    posX: number
    posY: number
    resources: number
    unlocks: UserUnlocks[]
  }


  // ===== MONGO SCHEMA ===== //

  export const Schema = new MongooseSchema({
    _id: {
      type: String,
      default: () => Date.now().toString(16) + randomBytes(3).toString('hex').padStart(6, '0')
    },
    uuid: {
      type: String,
      required: true
    },
    authn: {
      type: Object,
      required: true
    },
    tos: {
      type: Boolean,
      default: () => false
    },
    posX: {
      type: Number,
      default: () => World.newInitSpawnPos()[0]
    },
    posY: {
      type: Number,
      default: () => World.newInitSpawnPos()[1]
    },
    resources: {
      type: Number,
      default: () => Const.startingResources
    },
    unlocks: {
      type: [ Number ],
      default: () => []
    }
  }, { collection: 'users' })


  // ===== UTILITY FUNCTIONS ===== //


  // ===== SANITIZER ===== //

  export function sanitize(raw: Type): SanitizedType {
    return {
      id: raw._id,
      uuid: raw.uuid,
      tos: raw.tos,
      posX: raw.posX,
      posY: raw.posY,
      resources: raw.resources,
      unlocks: raw.unlocks
    }
  }

}