import mongoose from 'mongoose';
import { INoteItem } from './INoteItem'

export interface INote {
  _id: string;
  name: string;
  items: mongoose.Types.Array<INoteItem>;
}