import type { Friend } from "../models/friend-model.js";
import type { PageOptions, PageResults } from "../core/pagination.types.js";
declare class FriendsRepository {
    private static instance;
    private friends;
    private db;
    /**
     * Singleton accessor to ensure only one repository instance exists.
     */
    static getInstance(): FriendsRepository;
    /**
     * Private constructor initializes the local array from the 'friends' table
     * in the persistent JSON storage.
     */
    private constructor();
    /**
     * Internal helper to persist changes to the physical file.
     */
    private persist;
    /**
     * Adds a new friend and saves to disk.
     */
    addFriend(friend: Friend): void;
    /**
     * Finds a friend by their unique email.
     */
    findFriendByEmail(email: string): Friend | undefined;
    /**
     * Finds a friend by their phone number.
     */
    findFriendByPhone(phone: string): Friend | undefined;
    /**
     * Search implementation covering Name, Email, and Phone requirements.
     */
    searchFriends(query: string, pageOptions?: PageOptions): PageResults<Friend>;
    /**
     * Updates specific friend info while protecting the ID.
     */
    updateFriend(id: string, updates: Partial<Omit<Friend, 'id'>>): Friend | null;
    /**
     * Removes a friend by ID and persists the change.
     */
    removeFriend(id: string): boolean;
    /**
     * FIX: Re-added this method so the Controller can find and delete by name
     */
    removeFriendByName(name: string): boolean;
    /**
     * Requirement-specific helper to find by name.
     */
    findFriendByName(name: string): Friend | undefined;
    /**
     * Returns all stored friends.
     */
    getAllFriends(): Friend[];
}
export declare const friendsRepository: FriendsRepository;
export {};
//# sourceMappingURL=friends.repository.d.ts.map