import { Schema, model } from 'mongoose';

const bookSchema = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    publishedYear: { type: Number },
    addedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isAvailable: { type: Boolean, default: true },
    borrowedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    borrowedAt: { type: Date, default: null },
});

export default model('Book', bookSchema);
