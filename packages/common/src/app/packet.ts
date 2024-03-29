import { PoiType, UserUnlocks, WorldsEntities } from "./enums.js"


export namespace Packet {

  export type Data = [string, ...any]

  // 

  export namespace SC {
    
    export type DisconnectReason
      = 'invalid_handshake'
      | 'invalid_permit'
      | 'invalid_auth'
      | 'invalid_code'
      | 'new_connection' // this client got deconnected because the client opened a new connection from a different locaiton
      | 'kicked_by_host'
      | 'socket_hiccup'

    /** DISCONNECT USER */
    export function DISCONNECT(reason: DisconnectReason): Data {
      return [ 'DISCONNECT', reason ]
    }

    /** UPDATE USER'S OWN POSITION */
    export function POS(x: number, y: number, rot: number): Data {
      return [ 'POS', x, y, rot ]
    }

    /** ACKNOWLEDGES AN ENTITY SPAWN PACKET
     * newId can be NULL if the server declines the interaction
     */
    export function EACK(trans: number, newId: number): Data {
      return [ 'EACK', trans, newId ]
    }

    /** CREATES OR UPDATES AN ENTITY */
    export function UPDATE(id: number, type: number, x: number, y: number, data: any): Data {
      return [ 'UPDATE', id, type, x, y, data ]
    }

    /** REMOVES AN ENTITY */
    export function REMOVE(id: number): Data {
      return [ 'REMOVE', id ]
    }

    export type UserPropsUpdate = {
      resources: number
      extraRadiation: number
      unlocks: UserUnlocks[]
    }

    /** UPDATES OWN PROPERTIES */
    export function PROPS(data: Partial<UserPropsUpdate>): Data {
      return [ 'PROPS', data ]
    }

    /** [ xpos, ypos, type, name ] */
    export type Poi = [ number, number, PoiType, string ]

    /** OH A POINT OF INTEREST! INTERESTING! */
    export function POI(poi: Poi): Data {
      return [ 'POI', ...poi ]
    }

    /** UNLOCK JOURNAL THING */
    export function JOURNAL(name: string): Data {
      return [ 'JOURNAL', name ]
    }

    /** STRAIGHT UP ALERT SOMETHING */
    export function ALERT(text: string): Data {
      return [ 'ALERT', text ]
    }

  }

  export namespace CS {

    /** SET OWN POSITION */
    export function POS(x: number, y: number, rot: number): Data {
      return [ 'POS', x, y, rot ]
    }

    /** REQUEST A SCAN OF THE AREA WITH POWER POWER */
    export function SCAN(power: number): Data {
      return [ 'SCAN', power ]
    }

    /** SPAWNS AN ENTITY */
    export function SPAWN(trans: number, type: number, x: number, y: number, data: any): Data {
      return [ 'SPAWN', trans, type, x, y, data ]
    }

    /** SAY YOU MINED SOMETHING */
    export function MINE(entity: number, amount: number): Data {
      return [ 'MINE', entity, amount ]
    }

    /** SEND CHEAT CODE */
    export function CHEAT(code: string): Data {
      return [ 'CHEAT', code ]
    }

    /** PURCHASE AN ITEM */
    export function PURCHASE(shop: WorldsEntities, itemName: string): Data {
      return [ 'PURCHASE', shop, itemName ]
    }

  }

}
