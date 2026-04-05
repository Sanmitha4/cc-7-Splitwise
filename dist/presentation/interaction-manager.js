import * as readline from 'node:readline';
import { stdin as input, stdout as output } from 'node:process';
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
export const openInteractionManager = () => {
    const rl = readline.createInterface({ input, output });
    const ask = async (question, options) => {
        const { defaultAnswer, validator } = options || {};
        return new Promise((resolve) => {
            rl.question(`${question} ${defaultAnswer ? '(' + defaultAnswer + ')' : ''}: `, (answer) => {
                if (validator && !validator(answer)) {
                    console.log('Invalid input. Please try again.');
                    return resolve(ask(question, { defaultAnswer: defaultAnswer, validator: validator }));
                }
                resolve(answer || defaultAnswer);
            });
        });
    };
    const choose = async (question, choices, optional) => {
        console.log(question);
        choices.forEach((choice) => {
            console.log(`${choice.value},${choice.label}`);
        });
        const choice = await ask('Please enter your choice:', {
            validator: (input) => {
                if (!optional && input.trim() === '') {
                    return false;
                }
                return choices.some(choice => choice.value === input);
            }
        });
        return choices.find(c => c.value === choice);
    };
    const close = () => rl.close();
    return {
        ask,
        choose,
        close
    };
};
//# sourceMappingURL=interaction-manager.js.map