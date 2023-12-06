const mongoose = require("mongoose")

const Schema = mongoose.Schema

const DimensionSchema = new Schema({
    name: {type:String, required:true, unique: true},
    height: {type: Number, required:true},
    width: {type: Number, required:true},
})

DimensionSchema.virtual("orientation").get(function () {
    if (this.height>this.width){
        return 'Portrait'
    } else if (this.height<this.width){
        return 'Landscape'
    } else {
        return 'Square'
    }
});

DimensionSchema.virtual("display").get(function () {
    const roundedHeight = this.height.toFixed(2);
    const roundedWidth = this.width.toFixed(2);
    return `${this.Name} ${roundedHeight}mm x ${roundedWidth}mm - ${this.orientation}`;
});

DimensionSchema.virtual("url").get(function () {
    return `/size/${this._id}`;
});

//Export
module.exports = mongoose.model("Dimension", DimensionSchema);