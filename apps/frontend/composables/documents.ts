
/** document key -> has been read, false means it is new. not unlocked = not in record */
export const useDocuments = () => useState<Map<string, boolean>>('documents', () => new Map())

//

type Document = {
  key: string
  title: string
  text: string
}

export const useDocumentData = () => useState<Document[]>('document-data', () => [
  {
    key: 'intro',
    title: 'Intro: Setting sail',
    text: 'Hello. Welcome. You can find your ship\'s position data in the bottom left corner. The panel to the right of your position is your control panel. You can steer your ship there. Grab the handles to set a course and accelerate.'
  },
  {
    key: 'readwrite',
    title: 'Intro: Messages',
    text: 'Great, you know how to move now. See those green gems around you? You may need to zoom out a bit. Those are messages left by other people. You can hover them with your mouse to see what they wrote. You can also leave your own messages using the third panel at the bottom. Just be aware that leaving messages costs resources. More on them later. The longer the message or the more other messages nearby, the more expensive it is to write something. Go try it out!'
  },
  {
    key: 'mining',
    title: 'Intro: Getting resources',
    text: 'TODO'
  },
  {
    key: 'otherperson',
    title: 'Other Explorers',
    text: 'Did you see this? Another ship. An unknown explorer, just like you. Roaming around. Exploring. Say hi.'
  },
  {
    key: 'ring1',
    title: 'Ring 1',
    text: 'You entered ring 1. Be careful. Something in the center is emitting strong radiation. Obfuscating your radar. Obfuscating your other sensors. Don\'t get lost. We need you.'
  },
  {
    key: 'ring3',
    title: 'Ring 3',
    text: 'You entered ring 3. It\'s quiet here. Peaceful. Empty.'
  },
  {
    key: 'outerring',
    title: 'The unknown',
    text: 'You have left ring 3. The world beyond is not documented. Be careful.'
  },
])
