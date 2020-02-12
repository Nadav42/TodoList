import { INote } from '../interfaces/INote';
import mongoose from 'mongoose';
import noteItem from './item';

const NoteSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        items: [noteItem.schema]
    },
    { timestamps: true },
);

export default mongoose.model<INote & mongoose.Document>('notes', NoteSchema);
