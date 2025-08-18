import mongoose from './index.js';

const billSchema = new mongoose.Schema({
    billNo: {
        type: Number,
        required: true
    },
    company_name: {
        type: String,
        required: [true, 'Company name is required']
    },
    customer: {
        type: String,
        required: [true, 'Customer name is required']
    },
    items: [{
        a_id: Number,
        name: String,
        quantity: Number,
        price: Number, // Selling price
        profit: Number // Profit for each item
    }],
    totalAmount: {
        type: Number,
        required: [true, 'Total amount is required']
    },
    totalProfit: {
        type: Number,
        required: [true, 'Total profit is required']
    },
    billDate: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'bills',
    versionKey: false
});

const BillModel = mongoose.model("bills", billSchema);
export default BillModel;
