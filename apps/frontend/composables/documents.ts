

type Document<Key extends string> = {
  key: Key
  title: string
  text: string
}

const docsData = [
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
    text: 'Sooner or later you will run out of resources. To get more you need to harvest them. For that you need to know that each of your panels can be unplugged. Click the icon on the bottom left of a panel to do so. Once unplugged you can plug in a different panel. Switch one panel to the harvester. Fly around and locate a blue entity, those are resources. Use your cursor to focus on the resource and start harvesting.'
  },
  // TUTORIAL-ISH
  {
    key: 'otherperson',
    title: 'Other Explorers',
    text: 'Did you see this? Another ship. An unknown explorer, just like you. Roaming around. Exploring. Say hi.'
  },
  {
    key: 'poi',
    title: 'Points of interest',
    text: 'This was a strong scan. We located some points of interest and marked them on your map. Small dots are other explorers. The markers looking like gateways are landmarks that might be interesting to explore. The last kind, looking like a pin, you surely want to check out. These are merchants, traders or other important places.'
  },
  // "STORY"
  {
    key: 'teleport',
    title: 'Teleportation',
    text: 'Where the hell did you end up? This is not what the course dictated. Have you been teleported? Maybe we can use this power for good. Go find someone who can help you with that.'
  },
  // WORLD LOCATIONS
  
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
    title: 'The Unknown',
    text: 'You have left ring 3. The world beyond is not documented. Be careful.'
  },
  {
    key: 'worldent_westside_outpost',
    title: 'Westside Outpost',
    text: 'Welcome to Westside! Positioned on the border between ring 2 and 3, Westside is the perfect stopover for everything you need on the go. Happy shopping!'
  },
  {
    key: 'worldent_eastside_outpost',
    title: 'Eastside Outpost',
    text: 'Welcome to Eastside! Positioned on the border between ring 2 and 3, Eastside is the perfect stopover for everything you need on the go. Happy shopping!'
  },
  {
    key: 'worldent_central_market',
    title: 'Central Market',
    text: 'Welcome to Central Market! The biggest retailer of everthing an explorer will ever need. From replacements to new gear, there is nothing you won\'t find at Central Market.'
  },
  {
    key: 'worldent_belor_tools',
    title: 'Belor Tools',
    text: 'Named after the nearby Belor Rift, Belor Tools is providing you quality equipment for unbeatable low prices.'
  },
  {
    key: 'worldent_third_sector',
    title: 'Third Sector',
    text: '3rd Sector Goods is your partner for exploring the unknown regions. 3rd Sector has everything you need for your journey beyond the outer ring.'
  },
  {
    key: 'worldent_boujin',
    title: 'Boujin',
    text: 'For generations the myth of Boujin was told and passed down to those who came after. A number of individuals and groups have since taken on the name and claimed to be this very entity. And while the real Boujin is probably no longer operating, if it even existed after all, this impersonator seems open for trading.'
  },
] as const

export type DocumentId = (typeof docsData)[number]['key']

//

export const useDocumentData = () => useState<Document<DocumentId>[]>('document-data', () => [...docsData] as Document[])

/** document key -> has been read, false means it is new. not unlocked = not in record */
export const useDocuments = () => useState<Map<DocumentId, boolean>>('documents', () => new Map())
