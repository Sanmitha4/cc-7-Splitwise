export interface Friend{
    id:string;
    name:string;
    email:string;
    phone:string;
    balance:number; //+ve means they owe you, -ve means you owe them, 
    //createdAt:Date;
    //updatedAt:Date;

}

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
    searchFriends(querry: string, pageOptions?: pageOptions): PageResult<Friend> {
    const lowerQuerry = querry.toLowerCase();
    const filtered = this.friends.filter(
      (friend) =>
        friend.name.toLowerCase().includes(lowerQuerry) ||
        friend.email.toLowerCase().includes(lowerQuerry) ||
        friend.phone.toLowerCase().includes(lowerQuerry),
    );
    return {
      data: filtered.slice(
        pageOptions?.offset || 0,
        (pageOptions?.offset || 0) + (pageOptions?.limit || 5),
      ),
      matched: filtered.length,
      total: this.friends.length,
    };
  }

  test() {}
}

export const friendsRepository=new FriendsRepository();