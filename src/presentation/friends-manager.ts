import type {choice} from"./interaction-manager";
import { Friend } from "../models/friend-model.js";

const options:Choice[]=[
    {label:'Add friend',value:'1'},
    {label:'Search friend',value:'2'},
    {label:'Update friend',value:'3'},
    {label:'Remove friend',value:'4'},
    {label:'Exit',value:'5'}
]
const {ask,choose,close}=openInteractionManager();

const addFriend=async()=>{
    const name= await ask('Enter friend\'s name:');
    const email= await ask('Enter friend\'s email:');
    const phone= await ask('Enter friend\'s phone:');


    const openingBalance=await ask('Enter opening balance'{
        validator:numberValidator
    });

    const friend={
        id:Date.now().toString(),
        name:name!;
        email:email!;
        phone:phone!;
        balance:Number(openingBalance)
        
    }
    console.log('Friend added: ${name},${email},${phone}');
}


const searchFriend=async()=>{
    if(friends.length===0){
        console.log("Your friend list is empty");
        return;
    }
    const searchQuery=await ask("Enter a name,email or phone number to search");
    if(!searchQuery)return;

    const query =searchQuery.toLowerCase();

    const results=friends.filter(friend=>
        friend.name.toLowerCase().includes(query)||
        friend.email.toLowerCase().includes(query) ||
        friend.phone.includes(query)
    );
    if(results.length>0){
        console.log(`\n Found ${results.length} matching friends `)
        results.forEach(f=>{
            console.log(` Name:${f.name} | Email:${f.email} | Phone:${f.phone}`)
        })
        console.log("=======")
    }else{
        console.log("No friends matching is found")
    }

}

export const manageFriends=async()=>{
    while(true){
        const choice=await choose('What do you want to do?',options,false);
        
        switch (choice!.value){
            case '1':
                console.log('Adding friend...');
                break;
            case '2':
                console.log('Searching friend...');
                break;
            case '3':
                console.log('Updating friend...');
                break;
            case '4':
                console.log('Removing friend...');
                break;
            case '5':
                console.log('Exiting...');
                close();
                return;
        }
    }
}