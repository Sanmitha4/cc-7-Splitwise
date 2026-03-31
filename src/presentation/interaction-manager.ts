import * readline from'node:readline;

const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });

//export type ValidationFunctionConstructor=(errorMessage:string)=>ValidatorFn;

export interface AskOptions{
    defaultAnswer?:string|undefined;
    validator?:ValidatorFn|undefined;
}

export const ask = async (question:string, options?:AskOptions) => {
    const {defaultAnswer,validator}=options||{};

    return new Promise((resolve) => {
        rl.question(`${question} ${defaultAnswer ? '(' + defaultAnswer + ')' : ''}: `, (answer:string) => {
            if (validator && !validator(answer)) {
                console.log('Invalid input. Please try again.');
                return resolve(ask(question, {defaultAnswer:defaultAnswer, validator:validator}));
            }
            resolve(answer || defaultAnswer);
        });
    });
};

export interface Choice{
    label:string;
    value:string
}


// const genders:Choice[]=[
//     {label:'Male',value:'M'}
//     {label:'Female',value:'F'}
//     {label:'Other',value:'O'}

// ]

// const expenseTypes:Choice[]=[
//     {label:'Food',value:'FOOD'},
//     {label:'Transport',value:'TRANSPORT'},
//     {label:'Entertainment',value:'ENTERTAINMENT'}
// ]


export const choose=async (question:string,choices:Choice[])=>{
    console.log(question);
    choices.forEach((choice)=>{
        console.log(`${choice.value},${choice.label}`)
    });
    return ask('Please enter your choice:',{
        validator:(input)=>choices.some(choice=>choice.value===input)
    });


}

export const initialiseInterractionManager=()=>{
    const rl=readline.createInterface({input,output});

    return {
        ask,
        choose,
    }
}
