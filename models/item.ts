import { INoteItem } from '../interfaces/INoteItem';
import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        checked: { type: Boolean, default: false }
    },
    { timestamps: true },
);

export default mongoose.model<INoteItem & mongoose.Document>('items', ItemSchema);
