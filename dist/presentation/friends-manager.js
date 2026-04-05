// import type { Choice } from "./interaction-manager.js";
// import { openInteractionManager } from "./interaction-manager.js";
// import type { Friend } from "../models/friend-model.js";
// import { numberValidator } from "../core/validator/number.validator.js";
// import { friendsRepository } from "../repositories/friends.repository.js";
import { openInteractionManager } from "./interaction-manager.js";
import { numberValidator } from "../core/validator/number.validator.js";
import { friendsRepository } from "../repositories/friends.repository.js";
const options = [
    { label: 'Add friend', value: '1' },
    { label: 'Search friend', value: '2' },
    { label: 'Update friend', value: '3' },
    { label: 'Remove friend', value: '4' },
    { label: 'Exit', value: '5' }
];
const { ask, choose, close } = openInteractionManager();
/**
 * Captures user input to create a new friend.
 * Requirement: Name is mandatory; Email, Phone, and Address are collected.
 */
const addFriend = async () => {
    const name = await ask("Enter friend's name:");
    if (!name) {
        console.log("Name is required to add a friend.");
        return;
    }
    const email = await ask("Enter friend's email:");
    const phone = await ask("Enter friend's phone:");
    const address = await ask("Enter friend's address:");
    const openingBalance = await ask('Enter opening balance (use +ve if they owe you, -ve if you owe them):', {
        validator: numberValidator
    });
    const friend = {
        id: Date.now().toString(),
        name: name,
        email: email || "",
        phone: phone || "",
        address: address || "",
        balance: Number(openingBalance) || 0
    };
    friendsRepository.addFriend(friend);
    console.log(`Friend added: ${name} | ${email || 'No Email'} | ${phone || 'No Phone'}`);
};
/**
 * Implements the search functionality for Name, Email, or Phone.
 */
const searchFriend = async () => {
    const searchQuery = await ask("Enter a name, email, or phone number to search:");
    if (!searchQuery)
        return;
    // Fetching results from repository with default pagination
    const results = friendsRepository.searchFriends(searchQuery, { offset: 0, limit: 10 });
    if (results.match > 0) {
        console.log(`\nFound ${results.match} matching friend(s):`);
        results.data.forEach(f => {
            console.log(`ID: ${f.id} | Name: ${f.name} | Email: ${f.email} | Phone: ${f.phone} | Balance: ${f.balance}`);
        });
        console.log("===============================");
    }
    else {
        console.log("No friends matching that query were found.");
    }
};
/**
 * Updates specific fields of an existing friend record.
 */
const updateFriend = async () => {
    const id = await ask("Enter the ID of the friend to update:");
    if (!id)
        return;
    console.log("Leave blank to keep current value.");
    const name = await ask("New name:");
    const email = await ask("New email:");
    const phone = await ask("New phone:");
    const address = await ask("New address:");
    const updates = {};
    if (name)
        updates.name = name;
    if (email)
        updates.email = email;
    if (phone)
        updates.phone = phone;
    if (address)
        updates.address = address;
    const result = friendsRepository.updateFriend(id, updates);
    if (result) {
        console.log("Friend updated successfully.");
    }
};
/**
 * Removes a friend from the repository by their unique ID.
 */
const removeFriend = async () => {
    const id = await ask("Enter the ID of the friend to remove:");
    if (!id)
        return;
    const success = friendsRepository.removeFriend(id);
    if (success) {
        console.log("Friend removed successfully.");
    }
};
/**
 * Main loop for the Connection Module menu.
 */
export const manageFriends = async () => {
    while (true) {
        const choice = await choose('--- Friend Management ---', options, false);
        switch (choice?.value) {
            case '1':
                await addFriend();
                break;
            case '2':
                await searchFriend();
                break;
            case '3':
                await updateFriend();
                break;
            case '4':
                await removeFriend();
                break;
            case '5':
                console.log('Returning to main menu...');
                close();
                return;
            default:
                console.log("Invalid selection.");
                break;
        }
    }
};
//# sourceMappingURL=friends-manager.js.map