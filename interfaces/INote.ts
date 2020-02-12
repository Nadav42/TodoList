import { INoteItem } from './INoteItem'

export interface INote {
  _id: string;
  name: string;
  items: [INoteItem];
}