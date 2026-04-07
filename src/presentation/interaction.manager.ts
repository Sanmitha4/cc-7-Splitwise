import * as readline from 'node:readline';
import { stdin as input, stdout as output } from 'node:process';
import type { ValidatorFn } from '../core/validator/validator.type.js'; 

export interface AskOptions{
    defaultAnswer?:string|undefined;
    validator?:ValidatorFn|undefined;
}

export interface Choice{
    label:string;
    value:string
}
/*
const genders:Choice[]=[
    {label:'Male',value:'M'}
    {label:'Female',value:'F'}
    {label:'Other',value:'O'}

]
const expenseTypes:Choice[]=[
    {label:'Food',value:'FOOD'},
    {label:'Transport',value:'TRANSPORT'},
    {label:'Entertainment',value:'ENTERTAINMENT'}
]
*/
export const openInteractionManager=()=>{
    const rl=readline.createInterface({input,output});
    const ask: (question: string, options?: AskOptions) => Promise<string | undefined> = async (question: string, options?: AskOptions) => {
        const { defaultAnswer, validator } = options || {};

        return new Promise((resolve) => {
            rl.question(`${question} : `, (answer: string) => {
                const trimmedAnswer = answer.trim() || defaultAnswer;

                if (validator) {
                    const validationResult = validator(trimmedAnswer || "");

                    if (typeof validationResult === "string") {
                        console.log(`${validationResult}`); 
                        return resolve(ask(question, options)); 
                    }

                    if (validationResult === false) {
                        console.log('Invalid input. Please try again.');
                        return resolve(ask(question, options));
                    }
                }

                resolve(trimmedAnswer);
            });
        });
    };

    // ... rest of your code
//     const ask:(question:string,options?:AskOptions) =>Promise<string|undefined>= async (question:string, options?:AskOptions) => {
//     const {defaultAnswer,validator}=options||{};

//     return new Promise((resolve) => {
//         rl.question(`${question} ${defaultAnswer ? '(' + defaultAnswer + ')' : ''}: `, (answer:string) => {
//             if (validator && !validator(answer)) {
//                 console.log('Invalid input. Please try again.');
//                 return resolve(ask(question, {defaultAnswer:defaultAnswer, validator:validator}));
//             }
//             resolve(answer || defaultAnswer);
//         });
//     });
// };

const choose:(question:string,choices:Choice[],optional?:boolean)=>Promise<Choice|undefined>=async (question:string,choices:Choice[],optional?:boolean)=>{
    console.log(question);
    choices.forEach((choice)=>{
        console.log(`${choice.value},${choice.label}`)
    });
    const choice=await ask('Please enter your choice:',{
        validator:(input:string)=>{
            if(!optional && input.trim()===''){
                return false;
            }
            return choices.some(choice => choice.value === input);
        }
    });
    return choices.find(c=>c.value===choice);
}
const close=()=>rl.close();
return{
        ask,
        choose,
        close
    }
}
