import {openInteractionManager} from "./presentation/interaction-manager.ts";

import connectionManager from  ("./src/presentation/connection-manager.js");
import manageFriends = require("./src/presentation/friends-manager.js");

const run=async()={
    connectionManager.manageFriends()
}
run();