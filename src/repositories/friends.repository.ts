// export interface Friend{
//     id:string;
//     name:string;
//     email:string;
//     phone:string;
//     balance:number; //+ve means they owe you, -ve means you owe them, 
//     //createdAt:Date;
//     //updatedAt:Date;

// }

// class FriendsRepository{
//     private static instance:FriendsRepository;
//     static getInstance(){
//         if(!FriendsRepository.instance){
//             FriendsRepository.instance=new FriendsRepository();

//         }
//         return FriendsRepository.instance;

//     }
//     private constructor(){};
//     addFriend(friend:Friend){
//         this.friends.push(friend);
//         console.log('Friend added to repository:',friend);
//     }
//     findFriendByEmail(email:string){
//         return this.friends.find(friend=>friend.email===email);

//     }
//     findFriendByPhone(phone:string){
//         return this.friends.find(friend=>friend.phone===phone);
        
//     }
//     searchFriends(querry: string, pageOptions?: pageOptions): PageResult<Friend> {
//     const lowerQuerry = querry.toLowerCase();
//     const filtered = this.friends.filter(
//       (friend) =>
//         friend.name.toLowerCase().includes(lowerQuerry) ||
//         friend.email.toLowerCase().includes(lowerQuerry) ||
//         friend.phone.toLowerCase().includes(lowerQuerry),
//     );
//     return {
//       data: filtered.slice(
//         pageOptions?.offset || 0,
//         (pageOptions?.offset || 0) + (pageOptions?.limit || 5),
//       ),
//       matched: filtered.length,
//       total: this.friends.length,
//     };
// }
// updateFriend(id:String,updates:Partial<Omit<Friend,'id'>>> ):Friend|null{
//         const index =this.friends.findIndex(friend=>friend.id===id);

//         if(index ===-1){
//             console.error(`Update failed: Friend with id ${id} not found.`);
//             return null;
//         }
//         const updatedFriend = { ...this.friends[index], ...updates };

//         this.friends[index] = updatedFriend;

//         console.log('Friend updated in repository:', updatedFriend);
//         return updatedFriend;
//     }
//     removeFriend(id: string): boolean {
//         const index = this.friends.findIndex(friend => friend.id === id);
        
//         if (index === -1) {
//             console.error(`Remove failed: Friend with id ${id} not found.`);
//             return false; 
//         }

//         const removedFriend = this.friends.splice(index, 1)[0];
//         console.log(`Friend removed from repository:`, removedFriend);
//         return true;
//     }
  

//   test() {}


// export const friendsRepository=new FriendsRepository();
// import { AppDBManager } from '../core/storage/db.manager.js'; // FIX: Path to the new DB manager
// import type{ Friend } from "../models/friend-model.js";
// import type{ PageOptions, PageResults } from "../core/pagination.types.ts";

// class FriendsRepository {
//     private static instance: FriendsRepository;
//     // Fix: Added the missing private property to store data
//     private friends: Friend[] = []; 

//     static getInstance() {
//         if (!FriendsRepository.instance) {
//             FriendsRepository.instance = new FriendsRepository();
//         }
//         return FriendsRepository.instance;
//     }

//     // Private constructor ensures the Singleton pattern is respected
//     private constructor() {}

//     addFriend(friend: Friend) {
//         this.friends.push(friend);
//         console.log('Friend added to repository:', friend);
//     }

//     findFriendByEmail(email: string) {
//         return this.friends.find(friend => friend.email === email);
//     }

//     findFriendByPhone(phone: string) {
//         return this.friends.find(friend => friend.phone === phone);
//     }

//     searchFriends(query: string, pageOptions?: PageOptions): PageResults<Friend> {
//         const lowerQuery = query.toLowerCase();
//         const filtered = this.friends.filter(
//             (friend) =>
//                 friend.name.toLowerCase().includes(lowerQuery) ||
//                 friend.email.toLowerCase().includes(lowerQuery) ||
//                 friend.phone.toLowerCase().includes(lowerQuery)
//         );

//         return {
//             data: filtered.slice(
//                 pageOptions?.offset || 0,
//                 (pageOptions?.offset || 0) + (pageOptions?.limit || 5)
//             ),
//             match: filtered.length, // Ensure this matches your PageResults interface
//             total: this.friends.length,
//         };
//     }

//     // Fix: Changed 'String' to 'string'
//     updateFriend(id: string, updates: Partial<Omit<Friend, 'id'>>): Friend | null {
//         const index = this.friends.findIndex(friend => friend.id === id);

//         if (index === -1) {
//             console.error(`Update failed: Friend with id ${id} not found.`);
//             return null;
//         }

//         const updatedFriend:Friend = { ...this.friends[index], ...updates };
//         this.friends[index] = updatedFriend;

//         console.log('Friend updated in repository:', updatedFriend);
//         return updatedFriend;
//     }

//     removeFriend(id: string): boolean {
//         const index = this.friends.findIndex(friend => friend.id === id);

//         if (index === -1) {
//             console.error(`Remove failed: Friend with id ${id} not found.`);
//             return false;
//         }

//         const removedFriend = this.friends.splice(index, 1)[0];
//         console.log(`Friend removed from repository:`, removedFriend);
//         return true;
//     }

//     findFriendByName(name: string): Friend | undefined {
//         return this.friends.find(friend => friend.name === name);
//     }

//     removeFriendByName(name: string): boolean {
//         const index = this.friends.findIndex(friend => friend.name === name);
//         if (index === -1) return false;
//         this.friends.splice(index, 1);
//         return true;
//     }

//     getAllFriends(): Friend[] {
//         return this.friends;
//     }
// }

// // Fix: Use the Singleton getInstance() method instead of 'new'
// export const friendsRepository = FriendsRepository.getInstance();


import { AppDBManager } from '../core/storage/db.manager.js';
import type { Friend } from "../models/friend-model.js";
import type { PageOptions, PageResults } from "../core/pagination.types.js";

class FriendsRepository {
    private static instance: FriendsRepository;
    private friends: Friend[] = [];
    private db = AppDBManager.getInstance().getDB();

    /**
     * Singleton accessor to ensure only one repository instance exists.
     */
    static getInstance(): FriendsRepository {
        if (!FriendsRepository.instance) {
            FriendsRepository.instance = new FriendsRepository();
        }
        return FriendsRepository.instance;
    }

    /**
     * Private constructor initializes the local array from the 'friends' table 
     * in the persistent JSON storage.
     */
    private constructor() {
        this.friends = this.db.table('friends') as Friend[];
    }

    /**
     * Internal helper to persist changes to the physical file.
     */
    private persist() {
        AppDBManager.getInstance().save();
    }

    /**
     * Adds a new friend and saves to disk.
     */
    addFriend(friend: Friend) {
        this.friends.push(friend);
        this.persist();
        console.log(`Friend added to repository with id :${friend.id}1`, friend);
    }

    

    /**
     * Finds a friend by their unique email.
     */
    findFriendByEmail(email: string): Friend | undefined {
        return this.friends.find(friend => friend.email.toLowerCase() === email.toLowerCase());
    }

    /**
     * Finds a friend by their phone number.
     */
    findFriendByPhone(phone: string): Friend | undefined {
        return this.friends.find(friend => friend.phone === phone);
    }

    /**
     * Search implementation covering Name, Email, and Phone requirements.
     */
    searchFriends(query: string, pageOptions?: PageOptions): PageResults<Friend> {
        const lowerQuery = query.toLowerCase();
        const filtered = this.friends.filter(
            (friend) =>
                friend.name.toLowerCase().includes(lowerQuery) ||
                friend.email.toLowerCase().includes(lowerQuery) ||
                friend.phone.toLowerCase().includes(lowerQuery)
        );

        return {
            data: filtered.slice(
                pageOptions?.offset || 0,
                (pageOptions?.offset || 0) + (pageOptions?.limit || 5)
            ),
            match: filtered.length,
            total: this.friends.length,
        };
    }

    /**
     * Updates specific friend info while protecting the ID.
     */
    updateFriend(id: string, updates: Partial<Omit<Friend, 'id'>>): Friend | null {
        const index = this.friends.findIndex(friend => friend.id === id);

        if (index === -1) {
            console.error(`Update failed: Friend with id ${id} not found.`);
            return null;
        }

        // Merge existing data with updates and cast as Friend to satisfy type safety.
        const updatedFriend = { ...this.friends[index], ...updates } as Friend;
        this.friends[index] = updatedFriend;

        this.persist();
        console.log('Friend updated in repository:', updatedFriend.name);
        return updatedFriend;
    }

    /**
     * Removes a friend by ID and persists the change.
     */
    removeFriend(id: string): boolean {
        const index = this.friends.findIndex(friend => friend.id === id);

        if (index === -1) {
            console.error(`Remove failed: Friend with id ${id} not found.`);
            return false;
        }

        const removedFriend = this.friends.splice(index, 1)[0];
        
        // FIX: Check if removedFriend exists before accessing '.name' to satisfy TS
        if (removedFriend) {
            this.persist();
            console.log(`Friend removed from repository: ${removedFriend.name}`);
            return true;
        }
        
        return false;
    }

    /**
     * FIX: Re-added this method so the Controller can find and delete by name
     */
    removeFriendByName(name: string): boolean {
        const friend = this.findFriendByName(name);
        if (!friend) {
            console.error(`Remove failed: Friend with name ${name} not found.`);
            return false;
        }
        return this.removeFriend(friend.id);
    }
    

    /**
     * Requirement-specific helper to find by name.
     */
    findFriendByName(name: string): Friend | undefined {
        return this.friends.find(friend => friend.name.toLowerCase() === name.toLowerCase());
    }

    /**
     * Returns all stored friends.
     */
    getAllFriends(): Friend[] {
        return this.friends;
    }
}

export const friendsRepository = FriendsRepository.getInstance();