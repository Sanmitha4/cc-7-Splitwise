import type { Choice } from "./interaction.manager.js";
import { openInteractionManager } from "./interaction.manager.js";
import type { Friend } from "../models/friend.model.js";
import { numberValidator } from "../core/validator/number.validator.js";
import { friendsRepository } from "../repositories/friends.repository.js";
import { friendsController } from "../controller/friends.controller.js";
import { ConflictError } from "../core/errors/conflict.error.js";
import { 
    nameValidator, 
    emailValidator, 
    phoneValidator 
} from "../core/validator/addFriend.validator.js";

const options: Choice[] = [
  { label: "Add friend", value: "1" },
  { label: "List all friends", value: "2" },
  { label: "Search friend", value: "3" },
  { label: "Update friend", value: "4" },
  { label: "Remove friend", value: "5" },
  { label: "Exit", value: "6" },
];

const { ask, choose, close } = openInteractionManager();

// const addFriend = async () => {
//   const name = await ask("Enter friend's name:");
//   if (!name) {
//     console.log("Name is required to add a friend.");
//     return;
//   }

//   const email = await ask("Enter friend's email:");
//   const phone = await ask("Enter friend's phone:");
//   const openingBalance = await ask(
//     "Enter opening balance (use +ve if they owe you, -ve if you owe them):",
//     {
//       validator: numberValidator,
//     },
//   );

//   const friend: Friend = {
//     id: Date.now().toString(),
//     name: name!,
//     email: email!,
//     phone: phone!,
//     balance: Number(openingBalance) || 0,
//   };

//   await friendsRepository.addFriend(friend);
//   console.log(`Friend added: ${name} | ${email} | ${phone}`);
// };
const addFriend = async () => {
    const friendFormData = {
        name: '',
        email: '',
        phone: '',
        openingBalance: '0'
    };
    const showFriendForm = async () => {
    try {
      while(!friendFormData.name){
        const input=(await ask("Enter friend's name:",{validator:nameValidator}))??'';
        friendFormData.name=input;
        //if(friendsController.checkNameExists(input)){
        //   console.log(`The name ${input} already exist in database`);
        // }else{
        //   friendFormData.name=input;
        // }
      }

      while(!friendFormData.email){
        const input=(await ask("Enter friend's email:",{validator:emailValidator}))??'';
        if(friendsController.checkEmailExists(input)){
          console.log(`The email ${input} already exits in database `);
        }else{
          friendFormData.email=input;
        }
      }
      
      while(!friendFormData.phone){
        const input=(await ask("Enter friend's phone:",{validator:phoneValidator}))??'';
        if(friendsController.checkPhoneExists(input)){
          console.log(`The phone ${input} already exists in database`);
        }else{
          friendFormData.phone=input;
        }
      }
      friendFormData.openingBalance=(await ask ("Enter opening balance",{validator:numberValidator}))??'0';
      return friendFormData;

    } catch (error) {
        console.error("\n Friend registration interrupted.");
        return null;
    }
};

    const result = await showFriendForm();

    if (result) {
        try {
            const friend: Friend = {
                id: Date.now().toString(),
                name: result.name,
                email: result.email,
                phone: result.phone,
                balance: Number(result.openingBalance) || 0,
            };

            await friendsController.addFriend(friend);
            console.log(`\nFriend added: ${friend.name} | ${friend.email} | ${friend.phone}`);

        } catch (error) {
            if (error instanceof ConflictError) {
                console.log(`\nRegistration Failed: ${error.message}`);
                
                if (error.conflictError === "DUPLICATE_EMAIL") {
                    friendFormData.email = '';
                    
                }
            } else {
                console.error("\nSystem Error:", error);
            }
        }
    }
};

const listAllFriends = () => {
    const friends = friendsController.allFriends(); // Get data from Controller
    
    if (friends.length === 0) {
        console.log("\n Your friends list is empty.");
        return;
    }

    console.log("\n--- My Friends ---");

    const tableData = friends.map(f => ({
        "ID": f.id,
        "Name": f.name,
        "Email": f.email,
        "Phone": f.phone,
        "Balance": f.balance >= 0 ? `$${f.balance}` : `-$${Math.abs(f.balance)}`
    }));

    console.table(tableData); 
};

const searchFriend = async () => {
  if (friendsRepository.getAllFriends().length === 0) {
    console.log("Your friend list is empty.");
    return;
  }

  const searchQuery = await ask("Enter search query (Name, Email, or Phone):");
  if (!searchQuery) return;

  const results = friendsRepository.searchFriends(searchQuery);
  if (results.match > 0) {
        console.log(`\nFound ${results.match} matching friend(s):`);
        
        console.table(results.data.map((f: Friend) => ({
          ID: f.id,
          Name: f.name,
          Email: f.email,
          Phone:f.phone,
          Balance: f.balance
        })));
    } else {
        console.log("No matching friends found.");
    }
};
// const updateFriend = async () => {
//     // STEP 1: SEARCH
//     const query = await ask("Search for the friend to update (Name/Email/Phone):");
//     if (!query) return;

//     const queryResult = friendsRepository.searchFriends(query);

//     if (queryResult.match === 0) {
//         console.log("No friends found matching that query.");
//         return;
//     }

//     // STEP 2: DISPLAY & SELECT BY INDEX
//     console.log("\n--- Search Results ---");
//     // We map the data to ensure Index 1 corresponds to array position 0
//     console.table(queryResult.data.map((f: Friend, index: number) => ({
//         "Index": index + 1,
//         "ID": f.id,
//         "Name": f.name,
//         "Email": f.email,
//         "Phone": f.phone,
//         "Balance": f.balance
//     })));

//     const indexInput = await ask("Enter the Index number of the friend to update (or Enter to cancel):", {
//         validator: (val) => {
//             if (val === "") return true;
//             const num = parseInt(val);
//             return (!isNaN(num) && num > 0 && num <= queryResult.match) || "Please enter a valid index from the table.";
//         }
//     });

//     if (!indexInput) return;
//     const selectedFriend = queryResult.data[parseInt(indexInput) - 1];

//     console.log(`\nEditing: ${selectedFriend.name}. Leave blank to keep current value.`);

//     // STEP 3: INTERACTIVE FIELD UPDATES WITH RETRY LOOPS
    
//     // --- Update Name ---
//     let newName = selectedFriend.name;
//     let nameValid = false;
//     while (!nameValid) {
//         const input = await ask(`New name [${selectedFriend.name}]:`) || selectedFriend.name;
//         const validation = nameValidator(input); // Format check
        
//         if (validation !== true) {
//             console.log(validation);
//         } else if (input !== selectedFriend.name && friendsController.checkNameExists(input)) {
//             console.log(`The name ${input} is already taken by another friend.`); // DB check
//         } else {
//             newName = input;
//             nameValid = true;
//         }
//     }

//     // --- Update Email ---
//     let newEmail = selectedFriend.email;
//     let emailValid = false;
//     while (!emailValid) {
//         const input = await ask(`New email [${selectedFriend.email}]:`) || selectedFriend.email;
//         const validation = emailValidator(input); // Format check
        
//         if (validation !== true) {
//             console.log(validation);
//         } else if (input !== selectedFriend.email && friendsController.checkEmailExists(input)) {
//             console.log(`The email ${input} is already in use.`); // DB check
//         } else {
//             newEmail = input;
//             emailValid = true;
//         }
//     }

//     let newPhone = selectedFriend.phone;
//     let phoneValid = false;
//     while (!phoneValid) {
//         const input = await ask(`New phone [${selectedFriend.phone}]:`) || selectedFriend.phone;
//         const validation = phoneValidator(input); // Format check
        
//         if (validation !== true) {
//             console.log(validation);
//         } else if (input !== selectedFriend.phone && friendsController.checkPhoneExists(input)) {
//             console.log(`The phone number ${input} is already registered.`); // DB check
//         } else {
//             newPhone = input;
//             phoneValid = true;
//         }
//     }

//     const updatedData: Friend = {
//         ...selectedFriend,
//         name: newName,
//         email: newEmail,
//         phone: newPhone
//     };

//     await friendsController.updateFriends(updatedData); // Persist to database
    
//     console.log(`\nUpdate Successful! Current Details:`);
//     console.table([{
//         ID: updatedData.id,
//         Name: updatedData.name,
//         Email: updatedData.email,
//         Phone: updatedData.phone,
//         Balance: updatedData.balance
//     }]);
// };











// const updateFriend = async () => {
//     const query = await ask("Search for the friend you want to update (Name/Email/Phone):");
//     if (!query) return;

//     const queryResult = friendsRepository.searchFriends(query);

//     if (queryResult.match === 0) {
//         console.log("No friends found matching that query.");
//         return;
//     }

//     console.log("\n--- Search Results ---");
//     queryResult.data.map((f: Friend, index: number) => ({
//       "Index": index + 1,
//       "Name": f.name,
//       "Email": f.email,
//       "Phone": f.phone,
//       "Balance":f.balance
//     }));
    

//     const indexInput = await ask("Enter the Index number of the friend to update (or press Enter to cancel):", {
//         validator: (val) => {
//             if (val === "") return true;
//             const num = parseInt(val);
//             return (!isNaN(num) && num > 0 && num <= queryResult.match) || "Please enter a valid index from the table.";
//         }
//     });

//     if (!indexInput) return;
//     const selectedFriend = queryResult.data[parseInt(indexInput) - 1];



//     console.log(`\nEditing: ${selectedFriend.name}. Leave blank to keep current value.`);

//     const newName = await ask(`New name [${selectedFriend.name}]:`) || selectedFriend.name;
    
//     // Validate unique email if changed
//     let newEmail = selectedFriend.email;
//     let emailValid = false;
//     while (!emailValid) {
//         const input = await ask(`New email [${selectedFriend.email}]:`, { validator: emailValidator }) || selectedFriend.email;
//         if (input !== selectedFriend.email && friendsController.checkEmailExists(input)) {
//             console.log("This email is already taken by another friend.");
//         } else {
//             newEmail = input;
//             emailValid = true;
//         }
//     }

//     const newPhone = await ask(`New phone [${selectedFriend.phone}]:`, { validator: phoneValidator }) || selectedFriend.phone;

//     // STEP 4: SAVE
//     const updatedData: Friend = {
//         ...selectedFriend,
//         name: newName,
//         email: newEmail,
//         phone: newPhone
//     };

//     await friendsController.updateFriends(updatedData);
//     console.log(`\n${selectedFriend.name} updated successfully!`);
// };
const updateFriend = async () => {
  const id = await ask("Enter the id of the friend to update:");
  if (!id) return;

  console.log("Leave blank to keep current value.");
  const name = await ask("New name:");
  const email = await ask("New email:");
  const phone = await ask("New phone:");
  //const address = await ask("New address:");

  const updates: Partial<Omit<Friend, "id">> = {};
  if (name) updates.name = name;
  if (email) updates.email = email;
  if (phone) updates.phone = phone;
  //if (address) updates.address = address;

  const result = await friendsRepository.updateFriend(id, updates);

  if (result) {
    console.log(" Friend updated successfully.");
  } else {
    console.log(" Friend not found or update failed.");
  }
};

const removeFriend = async () => {
  const id = await ask("Enter the ID of the friend to remove:");
  if (!id) return;
  const success = await friendsRepository.removeFriend(id);

  if (success) {
    console.log("Friend removed successfully.");
  } else {
    console.log("Friend not found or removal failed.");
  }
};

export const manageFriends = async () => {
  while (true) {
    const choice = await choose("--- Friend Management ---", options, false);

    if (!choice) continue;

    switch (choice.value) {
      case "1":
        await addFriend();
        console.log('Adding friend...');
        break;
      case "2":
        await listAllFriends();
        console.log('List of friends....');
        break;
      case "3":
        await searchFriend();
        console.log('Searching friend...');
        break;
      case "4":
        await updateFriend();
        console.log('Updating friend...');
        break;
      case "5":
        await removeFriend();
        console.log('Removing friend...');
        break;
      case "6":
        console.log("Returning to main menu...");
        close();
        return;
      //     break;
      // default:
      //     console.log("Invalid selection.");
      //     break;
    }
  }
};
