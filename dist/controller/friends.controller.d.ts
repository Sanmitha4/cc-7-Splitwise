import type { Friend } from "../models/friend-model.js";
export declare class FriendsController {
    private repository;
    checkEmailExists(email: string): boolean;
    checkPhoneExists(phone: string): boolean;
    addFriend(friend: Friend): void;
    findFriend(name: string): Friend | undefined;
    updateFriends(friend: Friend): Promise<Friend | null> | {
        success: boolean;
    };
    removeFriends(name: string): {
        success: boolean;
    } | {
        success: Promise<boolean>;
    };
    allFriends(): Friend[];
}
export declare const friendsController: FriendsController;
//# sourceMappingURL=friends.controller.d.ts.map