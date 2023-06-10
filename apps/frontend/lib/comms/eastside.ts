import { Item, shopItems, userMeetsRequirements, UserUnlocks, WorldsEntities } from "@maanex/spacelib-common"
import { ArrowStr, renderTextBlock } from "./utils"


type State = {
  cursor: number
  focused: number | null
}

//

function renderItemInList(item: Item, selected: boolean, userResources: number, userUnlocks: UserUnlocks[], maxItemName: number): string {
  return item ? ((selected ? '> ' : '  ') + item.name.padEnd(maxItemName) + '   ' + `<${item.price(userResources, userUnlocks).toString()}>`.padStart(7)) : ''
}

export function commsEastside(state: State | null, pressed: ArrowStr | null, userResources: number, userUnlocks: UserUnlocks[]): [string, State] {
  if (!state)
    state = { cursor: 0, focused: null }

  const items = shopItems[WorldsEntities.MERCHANT_EASTSIDE_OUTPOST]!.filter(i => userMeetsRequirements(i.requires, userUnlocks) && i.unlocks.some(i => !userUnlocks.includes(i)))
  const maxItemName = Math.max(...items.map(i => i.name.length))

  if (state.focused === null) {
    if (pressed === 'down') state.cursor = (state.cursor + 1) % items.length
    else if (pressed === 'up') state.cursor = (state.cursor + items.length - 1) % items.length
    else if (pressed === 'right' && items.length) state.focused = state.cursor
  } else {
    if (pressed === 'left') state.focused = null
    else if (pressed === 'up' && items[state.focused].price(userResources, userUnlocks) <= userResources) {
      useSocket().sendPurchasePacket(WorldsEntities.MERCHANT_EASTSIDE_OUTPOST, items[state.focused].name)

      return [
        '\n\n\n\n        Thank you for your purchase!\n\n\n\n              ↑ or ↓ to continue',
        { cursor: 0, focused: null }
      ]
    }
  }

  const price = (state.focused === null) ? 0 : items[state.focused].price(userResources, userUnlocks)

  const text = (state.focused === null) ? [
    'Welcome to Eastside!',
    '-'.repeat(46),
    items.length ? renderItemInList(items[0], state.cursor === 0, userResources, userUnlocks, maxItemName) : 'Out of stock.',
    renderItemInList(items[1], state.cursor === 1, userResources, userUnlocks, maxItemName),
    renderItemInList(items[2], state.cursor === 2, userResources, userUnlocks, maxItemName),
    renderItemInList(items[3], state.cursor === 3, userResources, userUnlocks, maxItemName),
    renderItemInList(items[4], state.cursor === 4, userResources, userUnlocks, maxItemName),
    '-'.repeat(46),
    '↑↓ Navigate     → Select'
  ] : [
    '+' + '-'.repeat(44) + '+',
    '| ' + items[state.focused].name.padEnd(39 - price.toString().length) + ' <' + price.toString() + '> |',
    '+' + '-'.repeat(44) + '+',
    ...renderTextBlock(items[state.focused].details, '| ', ' |', 46, 4),
    '+' + '-'.repeat(44) + '+',
    price <= userResources ? '← Back     ↑ Purchase' : '← Back     Not enough resources'
  ]

  return [ text.join('\n'), state ]
}
