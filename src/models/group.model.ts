//import type { Row } from '../core/storage/db.js'; 

export interface Group   {
  id: string;
  name: string;
  membersIds:string[];
  createdAt:Date;
}