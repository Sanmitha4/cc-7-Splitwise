import type { Friend } from "../models/friend-model.js";
export declare class FriendsController {
    private repository;
    checkEmailExists(email: string): boolean;
    checkPhoneExists(phone: string): boolean;
    addFriend(friend: Friend): void;
    findFriend(name: string): Friend | undefined;
    updateFriends(friend: Friend): Friend | {
        success: boolean;
    } | null;
    emoveFriends(name: string): {
        success: boolean;
    };
    allFriends(): Friend[];
}
export declare const friendsController: FriendsController;
//# sourceMappingURL=friends.controller.d.ts.map