import { ArrowStr, Item, renderTextBlock } from "./utils"


type State = {
  cursor: number
  focused: number | null
}

const items: Item[] = [
  { name: 'Chicken', price: 399, details: 'Woah look at this chicken oh my' },
  { name: 'Other item', price: 1740, details: 'Lmao item 2 doesnt even have a name' },
  { name: 'Item 3', price: 899, details: 'Lmao item 3 doesnt even have a name either what is this lmao funny shit' },
]
const maxItemName = Math.max(...items.map(i => i.name.length))

//

function renderItemInList(item: Item, selected: boolean): string {
  return item ? ((selected ? '▶ ' : '  ') + item.name.padEnd(maxItemName) + '   ' + `<${item.price.toString()}>`.padStart(7)) : ''
}

export function commsWestside(state: State | null, pressed: ArrowStr | null): [string, State] {
  if (!state)
    state = { cursor: 0, focused: null }

  if (state.focused === null) {
    if (pressed === 'down') state.cursor = (state.cursor + 1) % items.length
    else if (pressed === 'up') state.cursor = (state.cursor + items.length - 1) % items.length
    else if (pressed === 'right') state.focused = state.cursor
  } else {
    if (pressed === 'up') alert('YE') // TODO buy
    else if (pressed === 'left') state.focused = null
  }

  const text = (state.focused === null) ? [
    'Welcome to Westside Outpost!',
    '-'.repeat(46),
    renderItemInList(items[0], state.cursor === 0),
    renderItemInList(items[1], state.cursor === 1),
    renderItemInList(items[2], state.cursor === 2),
    renderItemInList(items[3], state.cursor === 3),
    renderItemInList(items[4], state.cursor === 4),
    '-'.repeat(46),
    '↑↓ Navigate     → Select'
  ] : [
    '+' + '-'.repeat(44) + '+',
    '| ' + items[state.focused].name.padEnd(39 - items[state.focused].price.toString().length) + ' <' + items[state.focused].price.toString() + '> |',
    '+' + '-'.repeat(44) + '+',
    ...renderTextBlock(items[state.focused].details, '| ', ' |', 46, 4),
    '+' + '-'.repeat(44) + '+',
    '← Back     ↑ Purchase'
  ]

  return [ text.join('\n'), state ]
}
