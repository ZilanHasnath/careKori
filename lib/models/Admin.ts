import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdmin extends Document {
    name: string;
    email: string;
    password?: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}

const AdminSchema: Schema<IAdmin> = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Admin: Model<IAdmin> =
    mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);

export default Admin;