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

const updateFriend = async () => {
    // STEP 1: SEARCH (DRY - using repository method)
    const query = await ask("Search for the friend to update (Name/Email/Phone):");
    if (!query) return;

    const queryResult = friendsRepository.searchFriends(query); //

    if (queryResult.match === 0) {
        console.log("No friends found matching that query.");
        return;
    }

    // STEP 2: DISPLAY TABLE
    console.log("\n--- Search Results ---");
    console.table(queryResult.data.map((f: Friend, index: number) => ({
        "Index": index + 1, // Human readable 1-based index
        "ID": f.id,
        "Name": f.name,
        "Email": f.email,
        "Phone": f.phone,
        "Balance": f.balance
    })));

    // STEP 3: SELECT BY INDEX
    const indexInput = await ask("Enter the Index number of the friend to update (or Enter to cancel):", {
        validator: (val) => {
            if (val === "") return true;
            const num = parseInt(val);
            return (!isNaN(num) && num > 0 && num <= queryResult.match) || "Please enter a valid index from the table.";
        }
    });

    if (!indexInput) return;
    const selectedFriend = queryResult.data[parseInt(indexInput) - 1];
    if (!selectedFriend) {
    console.log("Error: Invalid selection. Please try again.");
    return; // This "guards" the rest of the code
}

    console.log(`\nEditing: ${selectedFriend.name}. Leave blank to keep current value.`);

    // STEP 4: INTERACTIVE FIELD UPDATES WITH VALIDATORS & UNIQUE CHECKS 
    
    // --- Update Name ---
    let newName = selectedFriend.name;
    const nameInput = await ask(`New name [${selectedFriend.name}]:`) || selectedFriend.name;
    // Format check using your existing validator
    if (nameValidator(nameInput) === true) {
        newName = nameInput;
    }

    // --- Update Email ---
    let newEmail = selectedFriend.email;
    let emailValid = false;
    while (!emailValid) {
        const input = await ask(`New email [${selectedFriend.email}]:`) || selectedFriend.email;
        const formatCheck = emailValidator(input); //
        
        if (formatCheck !== true) {
            console.log(formatCheck);
        } else if (input !== selectedFriend.email) {
            // UNIQUE CHECK: Check if email is used by ANYONE ELSE 
            const otherFriend = friendsRepository.getAllFriends().find(f => 
                f.email.toLowerCase() === input.toLowerCase() && f.id !== selectedFriend.id
            );
            
            if (otherFriend) {
                console.log(`The email ${input} is already taken by another friend.`);
            } else {
                newEmail = input;
                emailValid = true;
            }
        } else {
            emailValid = true; // Kept current email
        }
    }

    // --- Update Phone ---
    let newPhone = selectedFriend.phone;
    let phoneValid = false;
    while (!phoneValid) {
        const input = await ask(`New phone [${selectedFriend.phone}]:`) || selectedFriend.phone;
        const formatCheck = phoneValidator(input); //
        
        if (formatCheck !== true) {
            console.log(formatCheck);
        } else if (input !== selectedFriend.phone) {
            // UNIQUE CHECK: Check if phone is used by ANYONE ELSE 
            const otherFriend = friendsRepository.getAllFriends().find(f => 
                f.phone === input && f.id !== selectedFriend.id
            );

            if (otherFriend) {
                console.log(`The phone number ${input} is already registered to another friend.`);
            } else {
                newPhone = input;
                phoneValid = true;
            }
        } else {
            phoneValid = true; // Kept current phone
        }
    }

    // STEP 5: SAVE 
    const updatedData: Partial<Omit<Friend, 'id'>> = {
        name: newName,
        email: newEmail,
        phone: newPhone
    };

    await friendsRepository.updateFriend(selectedFriend.id, updatedData); //
    console.log(`\n${selectedFriend.name} updated successfully!`);
};

const removeFriend = async () => {
    // STEP 1: SEARCH (DRY - Reuse search logic)
    const query = await ask("Search for the friend to delete (Name/Email/Phone):");
    if (!query) return;

    const queryResult = friendsRepository.searchFriends(query);

    if (queryResult.match === 0) {
        console.log("No matching friends found.");
        return;
    }

    // STEP 2: DISPLAY TABLE
    console.log("\n--- Search Results ---");
    console.table(queryResult.data.map((f: Friend, index: number) => ({
        
        "ID": f.id,
        "Name": f.name,
        "Email": f.email,
        "Phone": f.phone,
        "Balance": f.balance
    })));

    // STEP 3: SELECT BY INDEX
    const indexInput = await ask("Enter the Index number to delete (or Enter to cancel):", {
        validator: (val) => {
            if (val === "") return true;
            const num = parseInt(val);
            return (!isNaN(num) && num > 0 && num <= queryResult.match) || "Please enter a valid index.";
        }
    });

    if (!indexInput) return;
    const selectedFriend = queryResult.data[parseInt(indexInput) - 1];

    if (!selectedFriend) {
        console.log("Error: Invalid selection.");
        return;
    }

    // STEP 4: BALANCE CHECK & FIRST CONFIRMATION
    if (selectedFriend.balance !== 0) {
        const balanceStatus = selectedFriend.balance > 0 
            ? `owes you $${selectedFriend.balance}` 
            : `is owed $${Math.abs(selectedFriend.balance)}`;
        
        console.log(`\nWARNING: This friend still ${balanceStatus}.`);
        const confirmBalance = await ask("Are you sure you want to proceed with deletion? (yes/no):");
        
        if (confirmBalance?.toLowerCase() !== 'yes') {
            console.log("Deletion cancelled.");
            return;
        }
    }

    // STEP 5: FINAL CONFIRMATION WITH DETAILS
    console.log("\n--- Final Confirmation: Friend to be Deleted ---");
    console.table([{
        ID: selectedFriend.id,
        Name: selectedFriend.name,
        Email: selectedFriend.email,
        Phone: selectedFriend.phone,
        Balance: selectedFriend.balance
    }]);

    const finalConfirm = await ask(`Are you absolutely sure you want to delete ${selectedFriend.name}? (yes/no):`);

    if (finalConfirm?.toLowerCase() === 'yes') {
        // STEP 6: EXECUTE DELETION
        const success = await friendsRepository.removeFriend(selectedFriend.id);
        if (success) {
            console.log(`\nSuccess: ${selectedFriend.name} has been removed.`);
        } else {
            console.log("\nError: Deletion failed in the database.");
        }
    } else {
        console.log("\nDeletion unsuccessful. Returning to main menu.");
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
