import { friendsRepository } from "../repositories/friends.repository.js";
export class FriendsController {
    repository = friendsRepository;
    checkEmailExists(email) {
        return false;
    }
    checkPhoneExists(phone) {
        return false;
    }
    addFriend(friend) {
        console.log('Adding friend to database...', friend);
        this.repository.addFriend(friend);
    }
    findFriend(name) {
        if (!this.repository) {
            return undefined;
        }
        return this.repository.findFriendByName(name);
    }
    updateFriends(friend) {
        if (!this.repository) {
            return { success: false };
        }
        console.log(`Updated ${friend.name}...`);
        const { id, ...updates } = friend;
        return this.repository.updateFriend(id, updates);
    }
    emoveFriends(name) {
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
//# sourceMappingURL=friends.controller.js.map