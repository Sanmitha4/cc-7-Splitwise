// import type { Choice } from "./interaction-manager.js";
// import { openInteractionManager } from "./interaction-manager.js";
// import type { Friend } from "../models/friend-model.js";
// import { numberValidator } from "../core/validator/number.validator.js";
// import { friendsRepository } from "../repositories/friends.repository.js";

// const options:Choice[]=[
//     {label:'Add friend',value:'1'},
//     {label:'Search friend',value:'2'},
//     {label:'Update friend',value:'3'},
//     {label:'Remove friend',value:'4'},
//     {label:'Exit',value:'5'}
// ]
// const {ask,choose,close}=openInteractionManager();

// const addFriend=async()=>{
//     const name= await ask('Enter friend\'s name:');
//     const email= await ask('Enter friend\'s email:');
//     const phone= await ask('Enter friend\'s phone:');

//     const openingBalance=await ask('Enter opening balance',{
//         validator:numberValidator
//     });

//     const friend={
//         id:Date.now().toString(),
//         name:name!,
//         email:email!,
//         phone:phone!,
//         balance:Number(openingBalance)
        
//     }
//     friendsRepository.addFriend(friend)
//     console.log('Friend added: ${name},${email},${phone}');
// }


// // const searchFriend=async()=>{
// //     if(friends.length===0){
// //         console.log("Your friend list is empty");
// //         return;
// //     }
// //     const searchQuery=await ask("Enter a name,email or phone number to search");
// //     if(!searchQuery)return;

// //     const query =searchQuery.toLowerCase();

// //     const results=friends.filter(friend=>
// //         friend.name.toLowerCase().includes(query)||
// //         friend.email.toLowerCase().includes(query) ||
// //         friend.phone.includes(query)
// //     );
// //     if(results.length>0){
// //         console.log(`\n Found ${results.length} matching friends `)
// //         results.forEach(f=>{
// //             console.log(` Name:${f.name} | Email:${f.email} | Phone:${f.phone}`)
// //         })
// //         console.log("=======")
// //     }else{
// //         console.log("No friends matching is found")
// //     }
// // }



// const updateFriend = async () => {
//     const id = await ask("Enter the ID of the friend to update:");
//     if (!id) return;

//     console.log("Leave blank to keep current value.");
//     const name = await ask("New name:");
//     const email = await ask("New email:");
//     const phone = await ask("New phone:");

//     const updates: Partial<Friend> = {};
//     if (name) updates.name = name;
//     if (email) updates.email = email;
//     if (phone) updates.phone = phone;

//     const result = friendsRepository.updateFriend(id, updates);
//     if (result) console.log("Friend updated successfully.");
// };

// const removeFriend = async () => {
//     const id = await ask("Enter the ID of the friend to remove:");
//     if (!id) return;

//     const success = friendsRepository.removeFriend(id);
//     if (success) console.log("Friend removed.");
// };

// export const manageFriends=async()=>{
//     while(true){
//         const choice=await choose('What do you want to do?',options,false);
        
//         switch (choice!.value){
//             case '1':
//                 await addFriend();
//                 console.log('Adding friend...');
//                 break;
//             case '2':
//                 await searchFriend();
//                 console.log('Searching friend...');
//                 break;
//             case '3':
//                 await updateFriend();
//                 console.log('Updating friend...');
//                 break;
//             case '4':
//                 await removeFriend();
//                 console.log('Removing friend...');
//                 break;
//             case '5':
//                 console.log('Exiting...');
//                 close();
//                 return;
//         }
//     }
// }
import type { Choice } from "./interaction-manager.js";
import { openInteractionManager } from "./interaction-manager.js";
import type { Friend } from "../models/friend-model.js";
import { numberValidator } from "../core/validator/number.validator.js";
import { friendsRepository } from "../repositories/friends.repository.js";

const options: Choice[] = [
    { label: 'Add friend', value: '1' },
    { label: 'Search friend', value: '2' },
    { label: 'Update friend', value: '3' },
    { label: 'Remove friend', value: '4' },
    { label: 'Exit', value: '5' }
];

const { ask, choose, close } = openInteractionManager();

/**
 * Adds a new friend to the system and persists to data.json
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

    const friend: Friend = {
        id: Date.now().toString(),
        name: name!,
        email: email!,
        phone: phone!,
        address: address!,
        balance: Number(openingBalance) || 0
    };

    // FIXED: Added await to ensure data is saved before printing success message
    await friendsRepository.addFriend(friend);
    console.log(`Friend added: ${name} | ${email} | ${phone}`);
};

/**
 * Searches for friends based on a string query
 */
const searchFriend = async () => {
    if (friendsRepository.getAllFriends().length === 0) {
        console.log("Your friend list is empty.");
        return;
    }

    const searchQuery = await ask("Enter search query (Name, Email, or Phone):");
    if (!searchQuery) return;

    const results = friendsRepository.searchFriends(searchQuery);

    if (results.match > 0) {
        console.log(`\n Found ${results.match} matching friend(s):`);
        
        results.data.forEach((f: Friend) => {
            const status = f.balance >= 0 ? "Lent" : "Owed";
            console.log(` ID: ${f.id} | Name: ${f.name} | ${status}: $${Math.abs(f.balance)}`);
        });
        console.log("-------------------------------");
    } else {
        console.log(" No matching friends found.");
    }
};

/**
 * Updates specific fields of an existing friend record.
 */
const updateFriend = async () => {
    const id = await ask("Enter the ID of the friend to update:");
    if (!id) return;

    console.log("Leave blank to keep current value.");
    const name = await ask("New name:");
    const email = await ask("New email:");
    const phone = await ask("New phone:");
    const address = await ask("New address:");

    const updates: Partial<Omit<Friend, 'id'>> = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (phone) updates.phone = phone;
    if (address) updates.address = address;

    // FIXED: Added await to resolve the Promise<Friend | null>
    const result = await friendsRepository.updateFriend(id, updates);
    
    if (result) {
        console.log(" Friend updated successfully.");
    } else {
        console.log(" Friend not found or update failed.");
    }
};

/**
 * Removes a friend from the repository by their unique ID.
 */
const removeFriend = async () => {
    const id = await ask("Enter the ID of the friend to remove:");
    if (!id) return;

    // FIXED: Added await to resolve the Promise<boolean>
    const success = await friendsRepository.removeFriend(id);
    
    if (success) {
        console.log("🗑️ Friend removed successfully.");
    } else {
        console.log("❌ Friend not found or removal failed.");
    }
};

/**
 * Main loop for the Friend Management menu.
 */
export const manageFriends = async () => {
    while (true) {
        const choice = await choose('--- Friend Management ---', options, false);

        if (!choice) continue;

        switch (choice.value) {
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
            //     break;
            // default:
            //     console.log("Invalid selection.");
            //     break;
        }
    }
};