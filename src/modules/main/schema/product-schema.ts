import { Schema } from 'mongoose';

const ProductSchema = new Schema(
    {
        productName: {
            type: String,
            required: false,
            defaultValue: "",
        },
        price: {
            type: Number,
            required: false,
            defaultValue: "",
        },
    },
    {
        timestamps: {
            createdAt: 'createdAt',
        },
    }
);

export default ProductSchema;