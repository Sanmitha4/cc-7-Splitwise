import type { Friend } from "../models/friend-model.js";
import type { PageOptions, PageResults } from "../core/pagination.types.js";
declare class FriendsRepository {
    private static sharedInstance;
    friends: Friend[];
    private constructor();
    static getInstance(): FriendsRepository;
    /**
     * Internal helper to trigger the DB save to data.json
     */
    private persist;
    /**
     * Adds a new friend and persists to storage
     */
    addFriend(friend: Friend): Promise<void>;
    findFriendByEmail(email: string): Friend | undefined;
    findFriendByPhone(phone: string): Friend | undefined;
    searchFriends(query: string, pageOptions?: PageOptions): PageResults<Friend>;
    updateFriend(id: string, updates: Partial<Omit<Friend, "id">>): Promise<Friend | null>;
    removeFriend(id: string): Promise<boolean>;
    removeFriendByName(name: string): Promise<boolean>;
    findFriendByName(name: string): Friend | undefined;
    getAllFriends(): Friend[];
}
export declare const friendsRepository: FriendsRepository;
export {};
//# sourceMappingURL=friends.repository.d.ts.map