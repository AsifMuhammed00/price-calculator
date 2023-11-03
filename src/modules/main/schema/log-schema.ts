import { Schema } from 'mongoose';

const LogSchema = new Schema(
    {
        products: {
            type: Array,
            required: false,
            defaultValue: [],
        },
        totalPrice: {
            type: Number,
            required: false,
            defaultValue: 0,
        },
    },
    {
        timestamps: {
            createdAt: 'createdAt',
        },
    }
);

export default LogSchema;