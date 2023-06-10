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

const outpostsSortiment = [
  ...simpleWriteColors,
  {
    name: 'Line Painter',
    price: () => 2000,
    details: 'Attach this module to your ship and you will be able to draw the line wherever you want. Quite literally.',
    unlocks: [ UserUnlocks.LINE_PAINTER ],
    requires: []
  },
  {
    name: 'Blue Line Paint',
    price: () => 100,
    details: 'This ink lets you draw blue lines',
    unlocks: [ UserUnlocks.LINEPAINT_COLOR_BLUE ],
    requires: [[ UserUnlocks.LINE_PAINTER ]]
  },
  {
    name: 'Green Line Paint',
    price: () => 100,
    details: 'This ink lets you draw green lines',
    unlocks: [ UserUnlocks.LINEPAINT_COLOR_GREEN ],
    requires: [[ UserUnlocks.LINE_PAINTER ]]
  },
  {
    name: 'Brown Line Paint',
    price: () => 100,
    details: 'This ink lets you draw brown lines',
    unlocks: [ UserUnlocks.LINEPAINT_COLOR_BROWN ],
    requires: [[ UserUnlocks.LINE_PAINTER ]]
  }
]


export const shopItems: Partial<Record<WorldsEntities, Item[]>> = {
  [WorldsEntities.MERCHANT_WESTSIDE_OUTPOST]: [ ...outpostsSortiment ],
  [WorldsEntities.MERCHANT_EASTSIDE_OUTPOST]: [ ...outpostsSortiment ],
  [WorldsEntities.MERCHANT_BELOR_TOOLS]: [
    {
      name: 'Yellow Message Ink',
      price: () => 99,
      details: 'This ink lets you engrave messages with a yellow emblem.',
      unlocks: [ UserUnlocks.SIMPLEWRITE_COLOR_YELLOW ],
      requires: []
    },
    {
      name: 'Red Message Ink',
      price: () => 199,
      details: 'This ink lets you engrave messages with a red emblem.',
      unlocks: [ UserUnlocks.SIMPLEWRITE_COLOR_RED ],
      requires: []
    },
    {
      name: 'Line Painter',
      price: () => 1700,
      details: 'Attach this module to your ship and you will be able to draw the line wherever you want. Quite literally.',
      unlocks: [ UserUnlocks.LINE_PAINTER ],
      requires: []
    },
    {
      name: 'Thick lines',
      price: () => 1700,
      details: 'This module will upgrade your line painter to be able to draw thicker lines',
      unlocks: [ UserUnlocks.LINEPAINT_THICK_STROKES ],
      requires: [[ UserUnlocks.LINEPAINT_COLOR_BLUE ],[ UserUnlocks.LINEPAINT_COLOR_GREEN ],[ UserUnlocks.LINEPAINT_COLOR_BROWN ]]
    },
    {
      name: 'Blue Line Paint',
      price: () => 80,
      details: 'This ink lets you draw blue lines',
      unlocks: [ UserUnlocks.LINEPAINT_COLOR_BLUE ],
      requires: [[ UserUnlocks.LINE_PAINTER ]]
    },
    {
      name: 'Green Line Paint',
      price: () => 80,
      details: 'This ink lets you draw green lines',
      unlocks: [ UserUnlocks.LINEPAINT_COLOR_GREEN ],
      requires: [[ UserUnlocks.LINE_PAINTER ]]
    },
    {
      name: 'Brown Line Paint',
      price: () => 80,
      details: 'This ink lets you draw brown lines',
      unlocks: [ UserUnlocks.LINEPAINT_COLOR_BROWN ],
      requires: [[ UserUnlocks.LINE_PAINTER ]]
    },
    {
      name: 'Yellow Line Paint',
      price: () => 80,
      details: 'This ink lets you draw yellow lines',
      unlocks: [ UserUnlocks.LINEPAINT_COLOR_YELLOW ],
      requires: [[ UserUnlocks.LINE_PAINTER ]]
    },
    {
      name: 'Red Line Paint',
      price: () => 80,
      details: 'This ink lets you draw red lines',
      unlocks: [ UserUnlocks.LINEPAINT_COLOR_RED ],
      requires: [[ UserUnlocks.LINE_PAINTER ]]
    },
    {
      name: 'Black Line Paint',
      price: () => 80,
      details: 'This ink lets you draw black lines',
      unlocks: [ UserUnlocks.LINEPAINT_COLOR_BLACK ],
      requires: [[ UserUnlocks.LINE_PAINTER, UserUnlocks.TELEPORT_KNOWLEDGE ]]
    },
    {
      name: 'Pink Line Paint',
      price: () => 80,
      details: 'This ink lets you draw pink lines',
      unlocks: [ UserUnlocks.LINEPAINT_COLOR_PINK ],
      requires: [[ UserUnlocks.LINE_PAINTER, UserUnlocks.LINEPAINT_THICK_STROKES ]]
    },
    {
      name: 'Orange Line Paint',
      price: () => 80,
      details: 'This ink lets you draw orange lines',
      unlocks: [ UserUnlocks.LINEPAINT_COLOR_ORANGE ],
      requires: [[ UserUnlocks.LINE_PAINTER, UserUnlocks.LINEPAINT_THICK_STROKES ]]
    },
    {
      name: 'Mint Line Paint',
      price: () => 80,
      details: 'This ink lets you draw mint lines',
      unlocks: [ UserUnlocks.LINEPAINT_COLOR_MINT ],
      requires: [[ UserUnlocks.LINE_PAINTER, UserUnlocks.LINEPAINT_THICK_STROKES ]]
    }
  ]
}