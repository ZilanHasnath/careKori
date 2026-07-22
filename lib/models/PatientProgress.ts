import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPatientProgress extends Document {
    jobId: mongoose.Types.ObjectId;
    caregiverId: mongoose.Types.ObjectId;
    patientId: mongoose.Types.ObjectId;
    bloodPressure: string;
    heartRate: number;
    meals: string;
    exercise: string;
    medicineStatus: string;
    patientMood: string;
    note: string;
    dateTime: Date;
    createdAt: Date;
    updatedAt: Date;
}

const PatientProgressSchema: Schema<IPatientProgress> = new Schema(
    {
        jobId: {
            type: Schema.Types.ObjectId,
            ref: 'Jobs',
            required: true,
        },
        caregiverId: {
            type: Schema.Types.ObjectId,
            ref: 'Caregiver',
            required: true,
        },
        patientId: {
            type: Schema.Types.ObjectId,
            ref: 'Patient',
            required: true,
        },
        bloodPressure: {
            type: String,
            required: true,
            trim: true,
        },
        heartRate: {
            type: Number,
            required: true,
            min: 0,
        },
        meals: {
            type: String,
            required: true,
            trim: true,
        },
        exercise: {
            type: String,
            required: true,
            trim: true,
        },
        medicineStatus: {
            type: String,
            required: true,
            trim: true,
        },
        patientMood: {
            type: String,
            required: true,
            trim: true,
        },
        note: {
            type: String,
            required: true,
            trim: true,
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

const PatientProgress: Model<IPatientProgress> =
    mongoose.models.PatientProgress ||
    mongoose.model<IPatientProgress>('PatientProgress', PatientProgressSchema);

export default PatientProgress;