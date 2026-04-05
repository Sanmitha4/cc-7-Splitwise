// export interface Friend{
//     id:string;
//     name:string;
//     email:string;
//     phone:string;
//     balance:number; //+ve means they owe you, -ve means you owe them, 
//     //createdAt:Date;
//     //updatedAt:Date;
// }

// import type { Row } from '../core/storage/db.js';

// export interface Friend extends Row {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   balance: number;
//   address: string;
// }

import type { Row } from '../core/storage/db.js'; // FIX: Path from models to core/storage

export interface Friend extends Row {
  id: string;
  name: string;
  email: string;
  phone: string;
  balance: number;
  address: string; // Ensure this matches your requirement for friend info
}