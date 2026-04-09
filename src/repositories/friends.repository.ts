import { AppDBManager } from "../models/db.manager.js";
import type { Friend } from "../models/friend.model.js";
import type { PageOptions, PageResults } from "../core/pagination.types.js";

class FriendsRepository {
  private static sharedInstance: FriendsRepository;
  friends: Friend[] = [];

  private constructor() {
    
    this.friends = AppDBManager.getInstance()
      .getDB()
      .table("friends") as Friend[];
  }

  static getInstance(): FriendsRepository {
    if (!this.sharedInstance) {
      this.sharedInstance = new FriendsRepository();
    }
    return this.sharedInstance;
  }

  private async persist(): Promise<void> {
    await AppDBManager.getInstance().save();
  }
  findFriendByName(name: string): Friend | undefined {
    return this.friends.find(
      (friend) => friend.name.toLowerCase() === name.toLowerCase(),
    );
  }

  async addFriend(friend: Friend): Promise<void> {
    this.friends.push(friend);
    await this.persist();
    console.log(`Friend added: ${friend.name}`);
  }
  
  // findFriendByName(name: string): Friend | undefined {
  //   return this.friends.find(
  //     (friend) => friend.name.toLowerCase() === name.toLowerCase(),
  //   );
  // }

  findFriendByEmail(email: string): Friend | undefined {
    return this.friends.find(
      (friend) => friend.email.toLowerCase() === email.toLowerCase(),
    );
  }

  findFriendByPhone(phone: string): Friend | undefined {
    return this.friends.find((friend) => friend.phone === phone);
  }

  searchFriends(query: string, pageOptions?: PageOptions): PageResults<Friend> {
    const lowerQuery = query.toLowerCase();
    const filtered = this.friends.filter(
      (friend) =>
        friend.name.toLowerCase().includes(lowerQuery) ||
        friend.email.toLowerCase().includes(lowerQuery) ||
        friend.phone.toLowerCase().includes(lowerQuery),
    );

    return {
      data: filtered.slice(
        pageOptions?.offset || 0,
        (pageOptions?.offset || 0) + (pageOptions?.limit || 5),
      ),
      match: filtered.length,
      total: this.friends.length,
    };
  }

  async updateFriend(
    id: string,
    updates: Partial<Omit<Friend, "id">>,
  ): Promise<Friend | null> {
    const index = this.friends.findIndex((friend) => friend.id === id);

    if (index === -1) {
      console.error(`Update failed: Friend with id ${id} not found.`);
      return null;
    }

    const updatedFriend = { ...this.friends[index], ...updates } as Friend;
    this.friends[index] = updatedFriend;

    await this.persist();
    console.log("Friend updated in repository:", updatedFriend.name);
    return updatedFriend;
  }

  async removeFriend(id: string): Promise<boolean> {
    const index = this.friends.findIndex((friend) => friend.id === id);

    if (index === -1) {
      console.error(`Remove failed: Friend with id ${id} not found.`);
      return false;
    }

    const removedFriend = this.friends.splice(index, 1)[0];

    if (removedFriend) {
      await this.persist();
      console.log(`Friend removed from repository: ${removedFriend.name}`);
      return true;
    }

    return false;
  }

  async removeFriendByName(name: string): Promise<boolean> {
    const friend = this.findFriendByName(name);
    if (!friend) {
      console.error(`Remove failed: Friend with name ${name} not found.`);
      return false;
    }
    return await this.removeFriend(friend.id);
  }

  // findFriendByName(name: string): Friend | undefined {
  //   return this.friends.find(
  //     (friend) => friend.name.toLowerCase() === name.toLowerCase(),
  //   );
  // }

  getAllFriends(): Friend[] {
    return this.friends;
  }
}

export const friendsRepository = FriendsRepository.getInstance();
