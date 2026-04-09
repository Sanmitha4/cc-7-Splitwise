import { manageFriends } from "./presentation/friends.manager.js"; 

const run = async () => {
    console.log("SPLITWISE STARTING...");
    await manageFriends(); 
};

run();