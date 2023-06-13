[X] mineable resources
  + spawn resources
  + ui to mine resources

[X] radar
  + scanning animation
  + updated "fetch"/"request" approach to receiving entities

[X] unlockable ship components
[X] npc merchants
[X] auto reconnect players if socket is lost for longer
[X] let users accept tos
[X] only start sound once "ingame"
[ ] add volume options
[X] desktop only screen
[ ] Casino?
[ ] Stars as background?
[X] discord webhook when someone writes something
[X] only allow ascii on messages
[X] allow messages to be multiline in rendering
[X] only activate miner if the target resource is actually mineable
[ ] Cut content: Boujin (sells portals)
[ ] Cut content: Central Market (sells a lot of stuff but more expensive. has sales. has clean interface)
[ ] Cut content: 3rd Sector Goods (sells advanced scanning devices)

[X] line entities
  + render line entities
  + ui to place line entities
  + show cost in ui before painting
  + unlock first? unlock colors?

[ ] make it more expensive to write in places where there's already a lot going on
  * find formula that works
  * communicate this through the ui

[X] points of interest
  + show on map
  + shopping?

[X] radiation
  + calc radiation score
  + display position offset
  + add more noise to radar view
  + add sound
  + make movement unpredictable

[X] add more journal hints
  + basic movement
  + next: how to read and write messages
  + when entering ring1: radiation and dangers
  + when entering ring3: outer world explained
  + when seeing another person
  + mining tutorial
  + points of interest
  * after some unlocks or time: different ship components

[X] update messages to have support for bigger ones + show author
[X] render other users properly
[X] sidebar resizeable
[X] update world spawn






unlockables:

- write messages
  * blue color
    * brown color
  * yellow color
    * red color
      * black color
      * white color
      * pink color
      * orange color
      * mint color

- scanner
  * scan unknown regions upgrade (extra module)

* hangar
  * rift magnet
  * deploy port (deploy consumeables)

* line painter
  * blue color
  * green color
  * yellow color
  * red color
    * pink color
    * orange color
    * mint color
    * brown color
  * thick strokes
  * curved lines

  * text painter
    * ...colors

(consumeables)
  + dropable portal
  + dropable shield (no writing)

[central market]
  + create guilds












/home/coder/repos/space.maanex.me/node_modules/mongoose/lib/model.js:503
    parallelSave = new ParallelSaveError(this);
                   ^

ParallelSaveError: Can't save() the same doc multiple times in parallel. Document: 1883068477592ce4e
    at model.save (/home/coder/repos/space.maanex.me/node_modules/mongoose/lib/model.js:503:20)
    at FlipflopCache.deprecateCacheItem [as onDeprecate] (file:///home/coder/repos/space.maanex.me/apps/backend/dist/database/user-manager.js:22:20)
    at FlipflopCache.collect (file:///home/coder/repos/space.maanex.me/apps/backend/dist/lib/flipflop-cache.js:48:26)
    at Timeout._onTimeout (file:///home/coder/repos/space.maanex.me/apps/backend/dist/lib/flipflop-cache.js:26:51)
    at listOnTimeout (node:internal/timers:561:11)
    at processTimers (node:internal/timers:502:7)
