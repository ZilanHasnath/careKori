import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICaregiver extends Document {
    name: string;
    phoneNumber: string;
    email?: string;
    location: string;
    expectedSalary: number;
    experience: string;
    sex: 'Male' | 'Female' | 'Other';
    age: number;
    nationalIdPassportNo: string;
    password?: string;
    accountType: 'Pending' | 'Approved';
    createdAt: Date;
    updatedAt: Date;
}

const CaregiverSchema: Schema<ICaregiver> = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        phoneNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: false,
            trim: true,
            lowercase: true,
        },
        location: {
            type: String,
            required: true,
            trim: true,
        },
        expectedSalary: {
            type: Number,
            required: true,
            min: 0,
        },
        experience: {
            type: String,
            required: true,
            trim: true,
        },
        sex: {
            type: String,
            enum: ['Male', 'Female', 'Other'],
            required: true,
        },
        age: {
            type: Number,
            required: true,
            min: 0,
        },
        nationalIdPassportNo: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        accountType: {
            type: String,
            enum: ['Pending', 'Approved'],
            required: true,
            default: 'Pending',
        },
    },
    {
        timestamps: true,
    }
);

const Caregiver: Model<ICaregiver> =
    mongoose.models.Caregiver || mongoose.model<ICaregiver>('Caregiver', CaregiverSchema);

export default Caregiver;