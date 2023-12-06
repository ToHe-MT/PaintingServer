const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AddressSchema = new Schema({
    country: { type: String, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true },
    postalCode: { type: String, required: true }
});

const BuyerSchema = new Schema({
    name: { type: String, required: true },
    address: { type: AddressSchema, required: true },

    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    //Optional, Maybe we can add birthday coupons,wishing them a happy birthday email??
    dateOfBirth: { type: Date },
    // orders: {type:[OrderSchema],required:false},
    wishlist: {type:[{ type: Schema.Types.ObjectId, ref: 'Painting' }]},
    currency: {
        type: String,
        default: 'USD'
    },
    lengthPreferences: {
        type: String,
        enum: ["inches", "centimeters"],
        default: "centimeters"
    }
});

module.exports = mongoose.model('Buyer', BuyerSchema);
