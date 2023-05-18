

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

    /** CREATES OR UPDATES AN ENTITY */
    export function UPDATE(id: number, type: number, x: number, y: number, data: any): Data {
      return [ 'UPDATE', id, type, x, y, data ]
    }

    /** REMOVES AN ENTITY */
    export function REMOVE(id: number): Data {
      return [ 'REMOVE', id ]
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
    export function SPAWN(type: number, x: number, y: number, data: any): Data {
      return [ 'SPAWN', type, x, y, data ]
    }

  }

}
