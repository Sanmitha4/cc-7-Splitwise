class FriendsRepository{
    private static instance:FriendsRepository;
    static getInstance(){
        if(!FriendsRepository.instance){
            FriendsRepository.instance=new FriendsRepository();

        }
        return FriendsRepository.instance;

    }
    private constructor(){};
    addFriend(friend:Friend){
        this.friends.push(friend);
        console.log('Friend added to repository:',friend);
    }
    findFriendByEmail(email:string){
        return this.friends.find(friend=>friend.email===email);

    }
    findFriendByPhone(phone:string){
        return this.friends.find(friend=>friend.phone===phone);
        
    }
searchFriends(lowercase)
friends.name
friends.email
friends.phone


export const friendsRepository=new FriendsRepository();