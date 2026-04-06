
import type { Friend } from "../models/friend-model.js";
import { friendsRepository } from "../repositories/friends.repository.js";

export class FriendsController {
    private repository = friendsRepository;

    checkEmailExists(email: string) {
        return false;
    }
    checkPhoneExists(phone: string) {
        return false;
    }
    addFriend(friend: Friend) {
        console.log('Adding friend to database...', friend);
        this.repository.addFriend(friend);
    }
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