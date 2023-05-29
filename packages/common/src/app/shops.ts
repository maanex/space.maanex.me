import { UserUnlocks, WorldsEntities } from "./enums.js"


export type Item = {
  name: string,
  price: (resources: number, unlocks: UserUnlocks[]) => number,
  details: string,
  /** unlocks all */
  unlocks: UserUnlocks[],
  /** outer: GROUP OF ORS, inner: GROUP OF ANDS */
  requires: UserUnlocks[][]
}

const simpleWriteColors: Item[] = [
  {
    name: 'Blue Message Ink',
    price: () => 50,
    details: 'This ink lets you engrave messages with a blue emblem.',
    unlocks: [ UserUnlocks.SIMPLEWRITE_COLOR_BLUE ],
    requires: []
  },
  {
    name: 'Brown Message Ink',
    price: () => 130,
    details: 'This ink lets you engrave messages with a brown emblem.',
    unlocks: [ UserUnlocks.SIMPLEWRITE_COLOR_BROWN ],
    requires: [[ UserUnlocks.SIMPLEWRITE_COLOR_BLUE ]]
  },
  {
    name: 'Yellow Message Ink',
    price: () => 100,
    details: 'This ink lets you engrave messages with a yellow emblem.',
    unlocks: [ UserUnlocks.SIMPLEWRITE_COLOR_YELLOW ],
    requires: []
  },
  {
    name: 'Red Message Ink',
    price: () => 200,
    details: 'This ink lets you engrave messages with a red emblem.',
    unlocks: [ UserUnlocks.SIMPLEWRITE_COLOR_RED ],
    requires: [[ UserUnlocks.SIMPLEWRITE_COLOR_YELLOW ]]
  },
  {
    name: 'Black Message Ink',
    price: () => 600,
    details: 'This ink lets you engrave messages with a black emblem.',
    unlocks: [ UserUnlocks.SIMPLEWRITE_COLOR_BLACK ],
    requires: [[ UserUnlocks.SIMPLEWRITE_COLOR_BROWN ], [ UserUnlocks.SIMPLEWRITE_COLOR_RED ]]
  },
  {
    name: 'White Message Ink',
    price: () => 1000,
    details: 'This ink lets you engrave messages with a white emblem.',
    unlocks: [ UserUnlocks.SIMPLEWRITE_COLOR_WHITE ],
    requires: [[ UserUnlocks.SIMPLEWRITE_COLOR_BROWN ], [ UserUnlocks.SIMPLEWRITE_COLOR_RED ]]
  },
  {
    name: 'Pink Message Ink',
    price: () => 4400,
    details: 'This ink lets you engrave messages with a pink emblem.',
    unlocks: [ UserUnlocks.SIMPLEWRITE_COLOR_PINK ],
    requires: [[ UserUnlocks.SIMPLEWRITE_COLOR_WHITE, UserUnlocks.SIMPLEWRITE_COLOR_BLACK ]]
  },
  {
    name: 'Orange Message Ink',
    price: () => 3300,
    details: 'This ink lets you engrave messages with a orange emblem.',
    unlocks: [ UserUnlocks.SIMPLEWRITE_COLOR_ORANGE ],
    requires: [[ UserUnlocks.SIMPLEWRITE_COLOR_WHITE, UserUnlocks.SIMPLEWRITE_COLOR_BLACK ]]
  },
  {
    name: 'Mint Message Ink',
    price: () => 2200,
    details: 'This ink lets you engrave messages with a mint emblem.',
    unlocks: [ UserUnlocks.SIMPLEWRITE_COLOR_MINT ],
    requires: [[ UserUnlocks.SIMPLEWRITE_COLOR_WHITE, UserUnlocks.SIMPLEWRITE_COLOR_BLACK ]]
  },
]


export const shopItems: Partial<Record<WorldsEntities, Item[]>> = {
  [WorldsEntities.MERCHANT_WESTSIDE_OUTPOST]: [
    ...simpleWriteColors,
    {
      name: 'Line Painter',
      price: () => 2000,
      details: 'Attach this module to your ship and you will be able to draw the line wherever you want. Quite literally.',
      unlocks: [ UserUnlocks.LINE_PAINTER ],
      requires: []
    }
  ]
}