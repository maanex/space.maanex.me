[ ] mineable resources
  * spawn resources
  * ui to mine resources

[ ] radar
  * scanning animation
  * updated "fetch"/"request" approach to receiving entities

[ ] line entities
  * render line entities
  * ui to place line entities
  * unlock first? unlock colors?

[ ] make it more expensive to write in places where there's already a lot going on
  * find formula that works
  * communicate this through the ui

[ ] points of interest
  * show on map
  * shopping?

[ ] radiation
  + calc radiation score
  + display position offset
  + add more noise to radar view
  + add sound
  * make movement unpredictable

[ ] add more journal hints
  + basic movement
  * next: how to read and write messages
  * when entering ring1: radiation and dangers
  * when entering ring3: outer world explained
  * when seeing another person
  * after some unlocks or time: different ship components
  * points of interest

[X] update messages to have support for bigger ones + show author
[X] render other users properly
[X] sidebar resizeable
[X] update world spawn
[ ] add points of interest (merchant?)











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
