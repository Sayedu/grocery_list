const mongoose = require('mongoose')


const productSchema = mongoose.Schema(
    {
        item:{
            type: String,
            requred: [true, "PLease enter item name"]
        },
        quantity:{
            type: Number,
            required: [true, "please enter quantity"],
            default: 1
        }
    },
    {
        timestamps: true
    }
    
)

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

