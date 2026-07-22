import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFamilyMember extends Document {
    familyMemberName: string;
    phoneNumber: string;
    email?: string;
    password?: string;
    location: string;
    linkedPatient: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const FamilyMemberSchema: Schema<IFamilyMember> = new Schema(
    {
        familyMemberName: {
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
        location: {
            type: String,
            required: true,
            trim: true,
        },
        linkedPatient: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Patient',
            },
        ],
    },
    {
        timestamps: true,
    }
);

const FamilyMember: Model<IFamilyMember> =
    mongoose.models.FamilyMember || mongoose.model<IFamilyMember>('FamilyMember', FamilyMemberSchema);

export default FamilyMember;