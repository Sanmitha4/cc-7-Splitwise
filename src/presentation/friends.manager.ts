import type { Choice } from "./interaction.manager.js";
import { openInteractionManager } from "./interaction.manager.js";
import type { Friend } from "../models/friend.model.js";
import { numberValidator } from "../core/validator/number.validator.js";
import { friendsRepository } from "../repositories/friends.repository.js";

const options: Choice[] = [
  { label: "Add friend", value: "1" },
  { label: "Search friend", value: "2" },
  { label: "Update friend", value: "3" },
  { label: "Remove friend", value: "4" },
  { label: "Exit", value: "5" },
];

const { ask, choose, close } = openInteractionManager();

const addFriend = async () => {
  const name = await ask("Enter friend's name:");
  if (!name) {
    console.log("Name is required to add a friend.");
    return;
  }

  const email = await ask("Enter friend's email:");
  const phone = await ask("Enter friend's phone:");
  //const address = await ask("Enter friend's address:");

  const openingBalance = await ask(
    "Enter opening balance (use +ve if they owe you, -ve if you owe them):",
    {
      validator: numberValidator,
    },
  );

  const friend: Friend = {
    id: Date.now().toString(),
    name: name!,
    email: email!,
    phone: phone!,
    //address: address!,
    balance: Number(openingBalance) || 0,
  };

  await friendsRepository.addFriend(friend);
  console.log(`Friend added: ${name} | ${email} | ${phone}`);
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
    console.log(`\n Found ${results.match} matching friend(s):`);

    results.data.forEach((f: Friend) => {
      const status = f.balance >= 0 ? "Lent" : "Owed";
      console.log(
        ` ID: ${f.id} | Name: ${f.name} | ${status}: $${Math.abs(f.balance)}`,
      );
    });
    console.log("-------------------------------");
  } else {
    console.log(" No matching friends found.");
  }
};


const updateFriend = async () => {
  const id = await ask("Enter the ID of the friend to update:");
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
        await searchFriend();
        console.log('Searching friend...');
        break;
      case "3":
        await updateFriend();
        console.log('Updating friend...');
        break;
      case "4":
        await removeFriend();
        console.log('Removing friend...');
        break;
      case "5":
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
