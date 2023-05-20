

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
    }

    /** UPDATES OWN PROPERTIES */
    export function PROPS(data: Partial<UserPropsUpdate>): Data {
      return [ 'PROPS', data ]
    }

  }

  export namespace CS {

    /** SET OWN POSITION */
    export function POS(x: number, y: number, rot: number): Data {
      return [ 'POS', x, y, rot ]
    }

    /** SET SCANNER SPEED */
    export function SCAN(speed: number): Data {
      return [ 'SCAN', speed ]
    }

    /** SPAWNS AN ENTITY */
    export function SPAWN(trans: number, type: number, x: number, y: number, data: any): Data {
      return [ 'SPAWN', trans, type, x, y, data ]
    }

  }

}
