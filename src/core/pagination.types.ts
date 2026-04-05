import type { Friend } from "../models/friend-model.js";

export interface PageOptions{
    offset:number,
    limit:number}
export interface PageResults<T>{
    data:T[];
    match:number;
    total:number;

}   

