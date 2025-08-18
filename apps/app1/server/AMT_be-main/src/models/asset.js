import mongoose from './index.js'


let assetSchema = new mongoose.Schema({
    a_name: {
        type: String,
        required: [true, 'Name is required']
    },
    b_name: {
        type: String,
        required: [true, 'Brand Name is required']
    },
    a_stock: {
        type: Number,
        required: [true, 'Stocks quantity is required']
    },
    without_GST:{
        type: Number,
        required: [true, 'Without GST price is required']
    },
    purchase_price:{
        type: Number,
        required: [true, 'Purchase Price is required']
    },

    selling_price:{
        type:Number,
        required:[true, 'Selling Price is required']
    },
    a_sales: {
        type: Number,
        default:0
    },
    a_id: {
        type: Number,
        required: [true, 'Asset ID is required']
    },
    a_position:{
        type: Number,
        required: [true, 'Product position is required']
    },
    status:{
        type:Boolean,
        default:true
    },
    company_name: {
        type: String,
        required: [true, 'Company name is required']
    },
    stock_last_update: {
        type: Date,
        default:Date.now()
    }
}, {
    collection: 'assets',
    versionKey: false
});

  const  assetsModel=mongoose.model("assets",assetSchema);

  export default assetsModel