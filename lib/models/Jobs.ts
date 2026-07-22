import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IJob extends Document {
    patientId: mongoose.Types.ObjectId;
    caregiverId: mongoose.Types.ObjectId;
    status: 'Active' | 'pending' | 'Rejected' | 'Finish';
    dateTime: Date;
    createdAt: Date;
    updatedAt: Date;
}

const JobSchema: Schema<IJob> = new Schema(
    {
        patientId: {
            type: Schema.Types.ObjectId,
            ref: 'Patient',
            required: true,
        },
        caregiverId: {
            type: Schema.Types.ObjectId,
            ref: 'Caregiver',
            required: true,
        },
        status: {
            type: String,
            enum: ['Active', 'pending', 'Rejected', 'Finish'],
            required: true,
            default: 'pending',
        },
        dateTime: {
            type: Date,
            required: true,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const Job: Model<IJob> =
    mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);

export default Job;