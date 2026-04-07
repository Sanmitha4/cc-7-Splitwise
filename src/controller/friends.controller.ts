import type { Friend } from "../models/friend.model.js";
import { friendsRepository } from "../repositories/friends.repository.js";
import { ConflictError } from "../core/errors/conflict.error.js";

export class FriendsController {
  private repository = friendsRepository;

  checkNameExists(name:string):boolean{
    return !!this.repository.findFriendByName(name);

  }

  checkEmailExists(email: string): boolean {
    return !!this.repository.findFriendByEmail(email);
  }

  checkPhoneExists(phone: string): boolean {
    return !!this.repository.findFriendByPhone(phone);
  }

  async addFriend(friend: Friend): Promise<void> {
    
    // if(this.checkNameExists(friend.name)){
    //   throw new ConflictError(
    //     `Name ${friend.name} is already used.`
    //   )
    // })
    if (this.checkNameExists(friend.name)) {
        throw new ConflictError(
            `a friend with name ${friend.name}  already exists.`, 
            "DUPLICATE_NAME",
            "name"
        );
    }

    if (this.checkEmailExists(friend.email)) {
        throw new ConflictError(
            `Email ${friend.email} is already in use.`, 
            "DUPLICATE_EMAIL",
            "email"
        );
    }

    if (this.checkPhoneExists(friend.phone)) {
        throw new ConflictError(
            `Phone ${friend.phone} is already registered.`, 
            "DUPLICATE_PHONE",
            "phone"
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
