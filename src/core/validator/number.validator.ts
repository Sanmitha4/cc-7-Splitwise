import type{ValidatorFn} from "./validator.type";

export const numberValidator:ValidatorFn=(input:string)=>{
    return !isNaN(+input);
}