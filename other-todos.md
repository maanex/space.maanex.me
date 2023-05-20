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