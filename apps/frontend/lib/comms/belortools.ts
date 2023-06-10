import { Item, UserUnlocks, WorldsEntities, shopItems, userMeetsRequirements } from "@maanex/spacelib-common"
import { ArrowStr, renderTextBlock } from "./utils"


type State = {
  page: null | 'guides' | 'gear' | 'upgrades'
  cursor: number
  selectedItem: Item | null
}

const guides: Item[] = [
  { name: 'How to not die from death', price: () => 0, details: 'lorem deez nutzs in my lorem lmao morelemroemauhdiuw ahidwhau aiwudhihafiesuhf ksajfeh isufhlvbk bhgfb jahsgb gasjhbsfaiga zfasuef g awhh aw awudha dadhadahwdiahdaiw dawudhaw diua a wduhaiw dhaw duahd a', unlocks: [], requires: [] },
  { name: 'Tutorial 2', price: () => 0, details: 'lorem deez nutzs in my lorem lmao morelemroemauhdiuw ahidwhau aiwudhihafiesuhf ksajfeh isufhlvbk bhgfb jahsgb gasjhbsfaiga zfasuef g awhh aw awudha dadhadahwdiahdaiw dawudhaw diua a wduhaiw dhaw duahd a', unlocks: [], requires: [] },
  { name: 'AHAHAHAHAHAHAHH', price: () => 0, details: 'lorem deez nutzs in my lorem lmao morelemroemauhdiuw ahidwhau aiwudhihafiesuhf ksajfeh isufhlvbk bhgfb jahsgb gasjhbsfaiga zfasuef g awhh aw awudha dadhadahwdiahdaiw dawudhaw diua a wduhaiw dhaw duahd a', unlocks: [], requires: [] },
  { name: 'This is another entry to the list with a slightly longer name', price: () => 0, details: 'lorem deez nutzs in my lorem lmao morelemroemauhdiuw ahidwhau aiwudhihafiesuhf ksajfeh isufhlvbk bhgfb jahsgb gasjhbsfaiga zfasuef g awhh aw awudha dadhadahwdiahdaiw dawudhaw diua a wduhaiw dhaw duahd a', unlocks: [], requires: [] },
]

//

function renderMenuBox(text: string, focus: boolean, width: number): string[] {
  const textSpace = width - 4
  const textExcess = textSpace - text.length
  const leftPad = Math.floor(textExcess / 2)
  const rightPad = Math.ceil(textExcess / 2)

  return focus ? [
    '/' + '¯'.repeat(width-2) + '\\',
    '|' + ' '.repeat(width-2) + '|',
    '| ' + ' '.repeat(leftPad) + text + ' '.repeat(rightPad) + ' |',
    '|' + ' '.repeat(Math.floor((width-2)/2-2)) + '↓  ↓' + ' '.repeat(Math.ceil((width-2)/2-2)) + '|',
    '|' + ' '.repeat(width-2) + '|',
    '\\' + '_'.repeat(width-2) + '/'
  ] : [
    ' '.repeat(width),
    ' ' + ' '.repeat(width-2) + ' ',
    '  ' + ' '.repeat(leftPad) + text + ' '.repeat(rightPad) + '  ',
    ' ' + ' '.repeat(width-2) + ' ',
    ' ' + ' '.repeat(width-2) + ' ',
    ' '.repeat(width)
  ]
}

function renderMenu(state: State): string[] {
  const boxes = [
    renderMenuBox('Guides', state.cursor === 0, 14),
    renderMenuBox('Gear', state.cursor === 1, 14),
    renderMenuBox('Upgrades', state.cursor === 2, 14),
  ]

  return [
    '             ~ Belor Tools Mtd. ~             ',
    '',
    ` ${boxes[0][0]} ${boxes[1][0]} ${boxes[2][0]} `,
    ` ${boxes[0][1]} ${boxes[1][1]} ${boxes[2][1]} `,
    ` ${boxes[0][2]} ${boxes[1][2]} ${boxes[2][2]} `,
    ` ${boxes[0][3]} ${boxes[1][3]} ${boxes[2][3]} `,
    ` ${boxes[0][4]} ${boxes[1][4]} ${boxes[2][4]} `,
    ` ${boxes[0][5]} ${boxes[1][5]} ${boxes[2][5]} `,
  ]
}

function renderItem(state: State, userResources: number, userUnlocks: UserUnlocks[]): string[] {
  return [
    '← Back                              Purchase →',
    '.'.repeat(46),
    'Name: ' + state.selectedItem!.name,
    'Price: ' + state.selectedItem!.price(userResources, userUnlocks),
    '',
    ...renderTextBlock(state.selectedItem!.details, '', '', 46, 4)
  ]
}

function renderListItem(text: string, focus: boolean, width: number): string[] {
  return renderTextBlock(text, focus ? ' > ' : '  ', focus ? ' ' : '  ', width, 2)
}

function renderList(items: string[], width: number, height: number, selected: number): string[] {
  return items.length
    ? items
      .map((item, idx) => renderListItem(item, selected === idx, width))
      .map(item => [ '.'.repeat(width), ...item ])
      .flat()
      .concat('.'.repeat(width), '                 ~ the end ~                  ')
      .slice(selected <= 1 ? 0 : (selected - 1) * 3)
      .slice(0, height)
    : [ '.'.repeat(width), '                 Out of stock                 ' ]
}

export function commsBelortools(state: State | null, pressed: ArrowStr | null, userResources: number, userUnlocks: UserUnlocks[]): [string, State] {
  if (!state)
    state = { page: null, cursor: 0, selectedItem: null }

  const items = shopItems[WorldsEntities.MERCHANT_BELOR_TOOLS]!.filter(i => userMeetsRequirements(i.requires, userUnlocks) && i.unlocks.some(i => !userUnlocks.includes(i)))
  const gearItems = [ UserUnlocks.LINE_PAINTER ]
  const lists = {
    guides,
    gear: items.filter(i => i.unlocks.some(u => gearItems.includes(u))),
    upgrades: items.filter(i => !i.unlocks.some(u => gearItems.includes(u)))
  }

  if (state.page === null) {
    if (pressed === 'right') state.cursor = Math.min(state.cursor + 1, 2)
    else if (pressed === 'left') state.cursor = Math.max(state.cursor - 1, 0)
    else if (pressed === 'down') {
      if (state.cursor === 0) state.page = 'guides'
      else if (state.cursor === 1) state.page = 'gear'
      else if (state.cursor === 2) state.page = 'upgrades'

      state.cursor = 0
    }
  } else if (state.selectedItem) {
    if (pressed === 'left') state.selectedItem = null
    else if (pressed === 'right') {
      useSocket().sendPurchasePacket(WorldsEntities.MERCHANT_BELOR_TOOLS, state.selectedItem.name)

      return [
        '\n\n\n        ----------------------------\n        Thank you for your purchase!\n        ----------------------------\n\n\n',
        { cursor: state.cursor, page: state.page, selectedItem: null }
      ]
    }
  } else {
    if (pressed === 'left') {
      if (state.page === 'guides') state.cursor = 0
      else if (state.page === 'gear') state.cursor = 1
      else if (state.page === 'upgrades') state.cursor = 2

      state.page = null
    }
    else if (pressed === 'down') state.cursor = Math.min(state.cursor + 1, lists[state.page].length - 1)
    else if (pressed === 'up') state.cursor = Math.max(state.cursor - 1, 0)
    else if (pressed === 'right') state.selectedItem = lists[state.page][state.cursor]
  }

  let text: string[] = []
  if (!state.page) text = renderMenu(state)
  else if (state.selectedItem) text = renderItem(state, userResources, userUnlocks)
  else text = [ '← Back                                Select →', ...renderList(lists[state.page].map(i => i.name), 46, 8, state.cursor) ]

  return [ text.join('\n'), state ]
}
