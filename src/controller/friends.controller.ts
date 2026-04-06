import type { Friend } from "../models/friend.model.js";
import { friendsRepository } from "../repositories/friends.repository.js";
import { ConflictError } from "../core/errors/conflict.error.js";

export class FriendsController {
  private repository = friendsRepository;

  checkEmailExists(email: string) {
    return false;
  }
  checkPhoneExists(phone: string) {
    return false;
  }
  async addFriend(friend: Friend): Promise<void> {
    // Business Rule Check
    if (this.checkEmailExists(friend.email)) {
        throw new ConflictError(
            `Email ${friend.email} is already in use.`, 
            "DUPLICATE_EMAIL"
            // "email"
        );
    }

    if (this.checkPhoneExists(friend.phone)) {
        throw new ConflictError(
            `Phone ${friend.phone} is already registered.`, 
            "DUPLICATE_PHONE"
            //"phone"
        );
    }

    console.log("Adding friend to database...", friend.name);
    await this.repository.addFriend(friend);
  }
  // addFriend(friend: Friend) {
  //   console.log("Adding friend to database...", friend);
  //   this.repository.addFriend(friend);
  // }
  findFriend(name: string) {
    if (!this.repository) {
      return undefined;
    }
    return this.repository.findFriendByName(name);
  }

  updateFriends(friend: Friend) {
    if (!this.repository) {
      return { success: false };
    }
    console.log(`Updated ${friend.name}...`);
    const { id, ...updates } = friend;
    return this.repository.updateFriend(id, updates);
  }
  removeFriends(name: string) {
    if (!this.repository) {
      return { success: false };
    }
    const success = this.repository.removeFriendByName(name);
    return { success };
  }
  allFriends() {
    return this.repository.getAllFriends();
  }
}

export const friendsController = new FriendsController();
