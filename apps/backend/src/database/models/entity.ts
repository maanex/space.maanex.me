/* eslint-disable spaced-comment */
import { Schema as MongooseSchema, Document as MongooseDocument } from 'mongoose'
import { EntityType } from '@maanex/spacelib-common'
import { EntityIds } from '../../lib/entity-ids'


export namespace EntityModel {

  // ===== ARRAY CONSTANTS ===== //

  // export const AnnouncementApprovalStatus = [ 'pending', 'declined', 'published' ] as const
  // export const AnnouncementApprovalStatusArray = AnnouncementApprovalStatus as readonly string[]
  // export type AnnouncementApprovalStatusType = typeof AnnouncementApprovalStatus[number]


  // ===== HELPER TYPES ===== //


  // ===== EXPORT TYPES ===== //

  /** A reduced type to use internally */
  export type DataType = {
    _id: number
    creator: string
    type: EntityType
    posX: number
    posY: number
    data: any
  }

  /** The user mongoose object, muteable and saveable */
  export type Type = DataType & Omit<MongooseDocument<any, {}>, '_id'>

  /** The sanitized version of the data, gets served out by the api */
  export type SanitizedType = {
    id: number
    creator: string
    type: EntityType
    posX: number
    posY: number
    data: any
  }


  // ===== MONGO SCHEMA ===== //

  export const Schema = new MongooseSchema({
    _id: {
      type: Number,
      default: () => EntityIds.createNew()
    },
    creator: {
      type: String,
      required: true
    },
    type: {
      type: Number,
      required: true
    },
    posX: {
      type: Number,
      required: true
    },
    posY: {
      type: Number,
      required: true
    },
    data: {
      type: {},
      default: () => null
    },
  }, { collection: 'entities' })


  // ===== UTILITY FUNCTIONS ===== //


  // ===== SANITIZER ===== //

  export function sanitize(raw: Type): SanitizedType {
    return {
      id: raw._id,
      creator: raw.creator.slice(-4),
      type: raw.type,
      posX: raw.posX,
      posY: raw.posY,
      data: raw.data,
    }
  }

}