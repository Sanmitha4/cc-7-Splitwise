import {openInteractionManager} from "./presentation/interaction-manager.ts";

import connectionManager from  ("./src/presentation/connection-manager.ts");
import manageFriends = require("./src/presentation/friends-manager.ts");

const run=async()={
    connectionManager.manageFriends()
}
run();