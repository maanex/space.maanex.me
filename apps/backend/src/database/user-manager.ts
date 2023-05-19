import { config } from ".."
import FlipflopCache from "../lib/flipflop-cache"
import { UserModel } from "./models/user"
import { Mongo } from "./mongo"


export namespace UserManager {

  const cache: FlipflopCache<UserModel.Type> = new FlipflopCache(config.caches.usersTtl, deprecateCacheItem)

  export async function getUser(id: string): Promise<UserModel.Type | null> {
    if (cache.has(id))
      return cache.get(id)

    const user = await Mongo.User.findById(id).exec()
    if (!user) return null

    introduceUser(user)
    return user
  }

  export function introduceUser(user: UserModel.Type) {
    cache.put(user._id, user)
  }

  async function deprecateCacheItem(user: UserModel.Type) {
    await user.save()
  }

}
