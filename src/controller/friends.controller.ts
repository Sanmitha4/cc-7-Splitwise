import type friendModel = require("../models/friend-model");

export class FriendsController{
    checkEmailExists(email:string){
        return false;
    }
    checkPhoneExists(phone:string){
        return false;
    }
    addFriend(friend:friendModel.Friend){
        console.log('Adding friend to database...',friend);
    }
}
export const friendsController = new FriendsController();