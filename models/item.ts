import { INoteItem } from '../interfaces/INoteItem';
import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema(
    {
        name: String,
        checked: Boolean
    },
    { timestamps: true },
);

export default mongoose.model<INoteItem & mongoose.Document>('items', ItemSchema);
