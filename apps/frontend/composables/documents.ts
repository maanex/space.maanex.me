
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
    key: 'howtogame',
    title: 'How to game',
    text: 'Start gaming.'
  },
  {
    key: 'howtoungame',
    title: 'How to un-game',
    text: 'Do not ungame. Serious warning.'
  },
  {
    key: 'bananas',
    title: 'What are bananas',
    text: 'Bananas are long curved yellow objects commonly used to feed monkeys and monkey-like creatures such as bongumas. Bananas are not to be messed with as bananas have quite the tactical advantage with areal attacks ranging up to 15km in their prime age.'
  }
])
