import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPatient extends Document {
    uniqueId: string;
    patientName: string;
    phoneNumber: string;
    email?: string;
    password?: string;
    age: number;
    sex: 'Male' | 'Female' | 'Other';
    location: string;
    illness: ('Paralysis' | 'accident patient' | 'general care' | 'old-age' | string)[];
    linkedFamilyMembers: mongoose.Types.ObjectId[];
    resetToken?: string;
    resetTokenExp?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const PatientSchema: Schema<IPatient> = new Schema(
    {
        uniqueId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        patientName: {
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
        password: {
            type: String,
            required: true,
        },
        age: {
            type: Number,
            required: true,
            min: 0,
        },
        sex: {
            type: String,
            enum: ['Male', 'Female', 'Other'],
            required: true,
        },
        location: {
            type: String,
            required: true,
            trim: true,
        },
        illness: {
            type: [String],
            required: true,
            default: [],
        },
        linkedFamilyMembers: [
            {
                type: Schema.Types.ObjectId,
                ref: 'FamilyMember',
            },
        ],
        resetToken: {
            type: String,
            default: null,
        },
        resetTokenExp: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Patient: Model<IPatient> =
    mongoose.models.Patient || mongoose.model<IPatient>('Patient', PatientSchema);

export default Patient;