const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PaintingSchema = new Schema({
    No: { type: Number, unique: true , required:true},
    title: { type: String, required: false },
    author: { type: String, default: "Stephanie May" },
    medium: { type: Schema.Types.ObjectId, ref: "Medium", required: true },
    dimension: { type: Schema.Types.ObjectId, ref: "Dimension", required: true },
    price:{type:String, required:true},
    status: { type: String, default: "Maintenance", enum: ['Maintenance', 'Available', 'Sold'], required: true},
    buyer: { type: Schema.Types.ObjectId, ref: "Buyer", required: false },
    info: { type: String, required: false },
    pictures: {type:[{
        type: mongoose.Types.ObjectId,
        ref: 'Image'
    }], required:false},
    datePurchased: { type: Date },
    dateCreated: { type: Date }
});

// Virtual for book's URL
PaintingSchema.virtual("url").get(function () {
    // We don't use an arrow function as we'll need the this object
    return `/painting/${this._id}`;
});

// Export model
module.exports = mongoose.model("Painting", PaintingSchema);