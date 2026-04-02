import type friendModel = require("../models/friend-model");

export interface PageOptions{
    offset:number,
    limit:number}
export interface PageResults<T>{
    data:T[];
    match:number;
    total:number;

}   
